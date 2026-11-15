/**
 * Caché L1+L2 genérica: L1 en memoria (lru-cache, sin latencia) y L2 en el Redis del sitio
 * (plt-infra-stage stacks/redis), compartido por las réplicas del servicio y que sobrevive
 * a reinicios.
 *
 * - L2 solo con REDIS_HOST + REDIS_PASSWORD (deployApp redisAuth: true) y CACHE_L2 != "false";
 *   sin ellas es exactamente un LRUCache.
 * - Redis lento (CACHE_L2_TIMEOUT_MS, 150 ms) o caído = fallo de caché, nunca error.
 * - Solo L1 (nunca a Redis): valores con secretos (seedbot, passbot, password, token...) y
 *   valores que JSON no conserva (Date, Buffer, Map, Set) o de más de 512 KB.
 */
import { LRUCache } from "lru-cache";
import Redis from "ioredis";

// Por nombre de campo, en cualquier nivel (apiKeys.openai, cuenta.seedbot, maxTokens...): ante la
// duda se queda en L1, nunca se expone.
const SENSIBLES = /seed|pass|secret|token|key|credential|auth|private/i;
const MAX_L2_BYTES = 512 * 1024;
const TIMEOUT_MS = Number(process.env.CACHE_L2_TIMEOUT_MS) || 150;
// wbsm:<servicio>: CACHE_L2_PREFIJO, nombre del paquete, NAMEAPPBOT (bot) o BASE_API (/api/pedido/v1 -> pedido)
const SERVICIO =
  process.env.CACHE_L2_PREFIJO ||
  process.env.npm_package_name ||
  process.env.NAMEAPPBOT ||
  (process.env.BASE_API || "").split("/").filter(Boolean)[1] ||
  "app";
const PREFIJO = `wbsm:${SERVICIO}`;

let cliente;
const clienteL2 = () => {
  if (cliente !== undefined) return cliente;
  if (process.env.CACHE_L2 === "false" || !process.env.REDIS_HOST || !process.env.REDIS_PASSWORD) {
    cliente = null;
    return cliente;
  }
  cliente = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
    enableOfflineQueue: false, // desconectado = fallo inmediato (L1 + fuente)
    maxRetriesPerRequest: 0,
    connectTimeout: 2000,
    commandTimeout: TIMEOUT_MS,
    retryStrategy: (intento) => Math.min(intento * 500, 10000)
  });
  cliente.on("error", () => {}); // L2 es opcional: sin ruido en el log
  return cliente;
};

// Conecta al cargar el modulo: sin cola offline, lo que llegue antes de conectar seria un fallo.
clienteL2();

// JSON solo si el valor vuelve igual de Redis y no trae secretos; si no, null (solo L1).
const serializaL2 = (valor) => {
  let apto = true;
  let json;
  try {
    json = JSON.stringify(valor, function (k, v) {
      const original = this[k];
      if (SENSIBLES.test(k) || original instanceof Date || Buffer.isBuffer(original) || original instanceof Map || original instanceof Set) {
        apto = false;
      }
      return v;
    });
  } catch {
    return null;
  }
  return apto && json !== undefined && json.length <= MAX_L2_BYTES ? json : null;
};

export const crearCacheL1L2 = ({ nombre, ttl, l2 = true, ...opcionesL1 }) => {
  const l1 = new LRUCache({ ttl, ...opcionesL1 });
  const clave = (k) => `${PREFIJO}:${nombre}:${k}`;
  const redis = () => (l2 ? clienteL2() : null);

  return {
    l1,
    /** Solo L1 (síncrono, igual que LRUCache.get). */
    get: (k) => l1.get(k),
    /** L2 y, si estaba, lo baja a L1. undefined = no está o Redis no respondió a tiempo. */
    async obtenerL2(k) {
      const c = redis();
      if (!c) return undefined;
      try {
        const crudo = await c.get(clave(k));
        if (crudo === null || crudo === undefined) return undefined;
        const valor = JSON.parse(crudo);
        l1.set(k, valor);
        return valor;
      } catch {
        return undefined;
      }
    },
    /** L1 y L2 (L2 en segundo plano; nunca bloquea ni falla). */
    set(k, valor, opciones = {}) {
      l1.set(k, valor, opciones);
      const c = redis();
      const json = c ? serializaL2(valor) : null;
      const ttlMs = opciones.ttl ?? ttl;
      if (json && ttlMs > 0) c.set(clave(k), json, "PX", ttlMs).catch(() => {});
    },
    delete(k) {
      l1.delete(k);
      redis()
        ?.del(clave(k))
        .catch(() => {});
    },
    /** Solo L1: L2 expira por TTL (no se recorre Redis). */
    clear: () => l1.clear()
  };
};

// Solo pruebas: cliente de Redis falso (o null) y reinicio.
export const _usarClienteL2 = (c) => {
  cliente = c;
};
