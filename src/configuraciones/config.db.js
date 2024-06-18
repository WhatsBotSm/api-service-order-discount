import pkg from 'pg';
const { Pool } = pkg;
const pool = { conexion: {} };
const environment = process.env.NODE_ENV || "local";
const namePool = 'api-service-order-' + environment
const dbConfig = global.gConfig.database_config_pg;

const getPool = (strPool) => {
  const credentials = environment === "local" ? dbConfig : { connectionString: dbConfig.stringConnection };
  if (!credentials) {
    throw new Error('Pool does not credentials');
  }
  if (!pool.conexion[strPool]) {
    pool.conexion[strPool] = new Pool(credentials);
  }
};

/**
 * @param {string}  strPool
 * @param  [dbConfig]
 * @return {Promise.<mssql.ConnectionPool>}
 */
export const getClient = (strPool) => {
  let poolQuery = strPool || namePool;
  getPool(poolQuery);
  console.log(poolQuery)
  return pool.conexion[poolQuery].connect();
}