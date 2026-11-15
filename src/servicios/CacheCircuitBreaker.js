// servicios/CacheCircuitBreaker.js
import { crearCacheL1L2 } from "./cacheL1L2.js";

const TTL_DEFAULT = 28 * 60 * 1000; // 28 minutos

class ApiCache {
  constructor() {
    // L1 en memoria + L2 en el Redis del sitio (solo si el servicio tiene REDIS_PASSWORD)
    this.cache = crearCacheL1L2({
      nombre: "api",
      max: 1000,
      ttl: TTL_DEFAULT,
      updateAgeOnGet: true,
      allowStale: false
    });
    this.inFlight = new Map();
  }

  get(key) {
    return this.cache.get(key);
  }

  // ttl en ms o { ttl } (así lo pasan los servicios): antes { ttl } quedaba como
  // { ttl: { ttl } } = TTL NaN, una entrada que nunca vencía en L1 y que Redis rechazaba.
  set(key, value, ttl = TTL_DEFAULT) {
    const ms = Number(ttl && typeof ttl === "object" ? ttl.ttl : ttl);
    return this.cache.set(key, value, { ttl: ms > 0 ? ms : TTL_DEFAULT });
  }

  hasInFlight(key) {
    return this.inFlight.has(key);
  }

  getInFlight(key) {
    return this.inFlight.get(key);
  }

  setInFlight(key, promise) {
    this.inFlight.set(key, promise);
    // catch: sin él, toda llamada que fallaba salía además como UNHANDLED REJECTION.
    promise.finally(() => this.inFlight.delete(key)).catch(() => {});
  }
}

class ApiCircuitBreaker {
  constructor({ failureThreshold = 3, cooldownTime = 5000 } = {}) {
    this.failureThreshold = failureThreshold;
    this.cooldownTime = cooldownTime;
    this.failures = 0;
    this.lastFailureTime = 0;
    this.isOpen = false;
  }

  async tryRequest(fn) {
    const now = Date.now();
    if (this.isOpen && now - this.lastFailureTime < this.cooldownTime) {
      throw new Error("Circuit breaker abierto");
    }

    try {
      const result = await fn();
      this.failures = 0;
      this.isOpen = false;
      return result;
    } catch (err) {
      this.failures++;
      this.lastFailureTime = now;
      if (this.failures >= this.failureThreshold) {
        this.isOpen = true;
      }
      throw err;
    }
  }
}

const apiCache = new ApiCache();
const circuitBreaker = new ApiCircuitBreaker({
  failureThreshold: 3,
  cooldownTime: 10000
});

// Respuesta fallida ({ codigo: 500 } de ConsumirServicio, o codigo distinto de "000"): no se
// cachea. Antes se guardaba (p. ej. consultaPhoneBot fallido) y el bot quedaba rechazado por
// todo el TTL. Lo que no trae codigo se cachea como siempre; null/falsy, igual que antes, no.
export const esCacheable = (result) =>
  Boolean(result) && !(typeof result === "object" && !Array.isArray(result) && "codigo" in result && String(result.codigo) !== "000");

export const callFnCache = async (key, apiFn, ttl) => {
  const cached = apiCache.get(key);
  if (cached) return cached;

  if (apiCache.hasInFlight(key)) {
    return apiCache.getInFlight(key);
  }

  try {
    // L2 (otra réplica o antes de reiniciar); si no está, la fuente con circuit breaker.
    // Lo que viene de L2 no se reescribe (si no, las réplicas lo renovarían y nunca expiraría).
    const promise = (async () => {
      const deL2 = await apiCache.cache.obtenerL2(key);
      if (deL2 !== undefined) return deL2;
      const result = await circuitBreaker.tryRequest(apiFn);
      if (esCacheable(result)) {
        apiCache.set(key, result, ttl);
      }
      return result;
    })();

    apiCache.setInFlight(key, promise);
    return await promise;
  } catch (error) {
    console.log(`Error para key: ${key} - ${error.message}`);
    throw error;
  }
};
