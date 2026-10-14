import pkg from "pg";
const { Pool } = pkg;

const environment = process.env.NODE_ENV || "stagedev";
const namePool = `api-admin-dashboard-${environment}`;
const dbConfig = global.gConfig?.database_config_pg;

const poolStore = Object.create(null);

// ---------------------------------------------------------------------------
// Timeouts a nivel de conexion (server-side).
//
// IMPORTANTE: statement_timeout, lock_timeout e idle_in_transaction_session_timeout
// NO son startup parameters validos para PostgreSQL. NO se pueden pasar via
// 'options' en el config (error 08P01: unsupported startup parameter in options).
//
// La forma correcta es aplicarlos DESPUES de conectar, en el evento 'connect'
// del pool, usando SET a nivel de sesion. Asi cada conexion nueva del pool
// hereda estos timeouts sin romper el startup packet.
// ---------------------------------------------------------------------------
const STATEMENT_TIMEOUT_MS = dbConfig?.statement_timeout || 30000;
const LOCK_TIMEOUT_MS = dbConfig?.lock_timeout || 5000;
const IDLE_IN_TX_TIMEOUT_MS = dbConfig?.idle_in_transaction_session_timeout || 60000;

// Cliente (node-postgres). Estas SI son claves directas validas.
const CLIENT_TIMEOUTS = {
  // Si una query no responde a tiempo, node la aborta y DESTRUYE la conexion,
  // evitando que quede colgada reteniendo un slot del pool.
  query_timeout: dbConfig?.query_timeout || 10000,

  // Client-side: limita la espera para obtener/crear una conexion del pool.
  connectionTimeoutMillis: dbConfig?.connectionTimeoutMillis || 5000,

  // TCP keepalive: evita que firewalls/NAT/IPVS (Docker swarm) descarten en
  // silencio las conexiones idle del pool (min: 2 las mantiene vivas
  // indefinidamente) y que el siguiente uso termine en 'read ECONNRESET'.
  keepAlive: true,
  keepAliveInitialDelayMillis: dbConfig?.keepAliveInitialDelayMillis || 10000
};

// SQL para aplicar timeouts server-side en cada conexion nueva.
const SESSION_TIMEOUTS_SQL = `
  SET statement_timeout = ${STATEMENT_TIMEOUT_MS};
  SET lock_timeout = ${LOCK_TIMEOUT_MS};
  SET idle_in_transaction_session_timeout = ${IDLE_IN_TX_TIMEOUT_MS};
`;

const buildCredentials = () => {
  if (!dbConfig) {
    throw new Error("database_config_pg is not defined in global.gConfig");
  }

  if (environment === "production") {
    return {
      connectionString: dbConfig.stringConnectionPg || dbConfig.stringConnection,
      ssl: { rejectUnauthorized: false },
      max: dbConfig.max || 20,
      min: dbConfig.min || 2,
      idleTimeoutMillis: dbConfig.idleTimeoutMillis || 30000,
      ...CLIENT_TIMEOUTS
    };
  }

  return {
    ...dbConfig,
    min: dbConfig.min || 2,
    max: dbConfig.max || 20,
    idleTimeoutMillis: dbConfig.idleTimeoutMillis || 30000,
    ...CLIENT_TIMEOUTS
  };
};

const getPool = (poolName = namePool) => {
  if (!poolStore[poolName]) {
    const credentials = buildCredentials();

    const newPool = new Pool(credentials);

    // Aplicar timeouts server-side en cada conexion nueva del pool.
    newPool.on("connect", async (client) => {
      // pg-pool solo escucha 'error' mientras el cliente esta idle. Si la
      // conexion se cae mientras esta prestado (getClient/transaction), el
      // Client emite 'error' sin listener -> uncaughtException. Este listener
      // permanente lo evita; la query en curso igual se rechaza con el error.
      client.on("error", (err) => {
        console.error(`[PG][${poolName}] client error:`, err.message);
      });
      try {
        await client.query(SESSION_TIMEOUTS_SQL);
      } catch (err) {
        console.error(`[PG][${poolName}] failed to set session timeouts:`, err.message);
      }
    });

    newPool.on("error", (err) => {
      console.error(`[PG][${poolName}] pool error:`, err.message);
    });

    poolStore[poolName] = newPool;
  }

  return poolStore[poolName];
};

export const getClient = async (poolName) => {
  const pool = getPool(poolName);
  return pool.connect();
};

// Estado del pool: util para detectar saturacion / conexiones colgadas.
export const getPoolStats = (poolName = namePool) => {
  const pool = poolStore[poolName];
  if (!pool) return { total: 0, idle: 0, waiting: 0, max: null };
  return {
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount,
    max: pool.options?.max ?? null
  };
};

export const query = async (text, params = [], poolName = namePool) => {
  const pool = getPool(poolName);
  return pool.query(text, params);
};

// Timeouts por defecto para toda transaccion (centralizados aqui, no en cada DAO).
const DEFAULT_STATEMENT_TIMEOUT = "60s";
const DEFAULT_LOCK_TIMEOUT = "10s";

// Errores de conexion (socket caido, backend terminado) en los que Postgres
// aborta la transaccion del lado servidor: es seguro reintentarla completa.
const TRANSIENT_DB_ERROR_CODES = new Set(["ECONNRESET", "EPIPE", "ETIMEDOUT", "ECONNREFUSED", "57P01", "57P02", "57P03", "08000", "08003", "08006"]);

export const isTransientDbError = (err) => TRANSIENT_DB_ERROR_CODES.has(err?.code) || /Connection terminated|not queryable/i.test(err?.message || "");

const DEFAULT_TRANSACTION_RETRIES = 2;
const TRANSACTION_RETRY_DELAY_MS = 200;

export const transaction = async (fn, options = {}) => {
  const {
    poolName = namePool,
    statementTimeout = DEFAULT_STATEMENT_TIMEOUT,
    lockTimeout = DEFAULT_LOCK_TIMEOUT,
    retries = DEFAULT_TRANSACTION_RETRIES
  } = typeof options === "string" ? { poolName: options } : options;

  for (let attempt = 0; ; attempt++) {
    const client = await getClient(poolName);
    let committing = false;
    let brokenErr;

    try {
      await client.query("BEGIN");
      if (statementTimeout) {
        await client.query(`SET LOCAL statement_timeout = '${statementTimeout}'`);
      }
      if (lockTimeout) {
        await client.query(`SET LOCAL lock_timeout = '${lockTimeout}'`);
      }
      const result = await fn(client);
      committing = true;
      await client.query("COMMIT");
      return result;
    } catch (err) {
      if (isTransientDbError(err)) {
        brokenErr = err;
      } else {
        try {
          await client.query("ROLLBACK");
        } catch (rollbackErr) {
          console.error(`[PG][${poolName}] rollback failed:`, rollbackErr.message);
        }
      }

      // Si la conexion cae durante COMMIT no sabemos si se confirmo: no se reintenta.
      if (brokenErr && !committing && attempt < retries) {
        console.warn(`[PG][${poolName}] transaction retry ${attempt + 1}/${retries}:`, err.message);
        await new Promise((resolve) => setTimeout(resolve, TRANSACTION_RETRY_DELAY_MS * (attempt + 1)));
        continue;
      }
      throw err;
    } finally {
      // release(err) destruye la conexion rota en lugar de devolverla al pool.
      client.release(brokenErr);
    }
  }
};

export const healthCheck = async (poolName = namePool) => {
  try {
    await query("SELECT 1", [], poolName);
    return { healthy: true };
  } catch (error) {
    return { healthy: false, error: error.message };
  }
};

export const pool = {
  get: getPool,
  query
};

export default {
  getClient,
  query,
  transaction,
  healthCheck
};
