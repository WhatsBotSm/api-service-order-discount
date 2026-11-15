import { describe, it, expect, vi, beforeAll } from "vitest";

vi.mock("../src/funciones/utilerias/RSABot.js", () => ({
  aclaraText: vi.fn((t) => `claro-${t}`),
  ofuscaText: vi.fn((t) => `ofus-${t}`)
}));

let RealtimeDatabase;
beforeAll(async () => {
  vi.resetModules();
  RealtimeDatabase = (await import("../src/funciones/firebase/realTimeDB.js")).default;
});

describe("RealtimeDatabase.getCuentaBot con caché", () => {
  it("la segunda consulta del mismo bot sale de la caché (una sola lectura a RTDB)", async () => {
    const phone = `52155${Date.now()}`;
    const once = vi.fn(async () => ({ exists: () => true, val: () => ({ cuenta: { phone, seedbot: "seed" } }) }));
    const db = { ref: vi.fn(() => ({ once })) };
    const rtdb = new RealtimeDatabase(db);
    const primera = await rtdb.getCuentaBot(phone);
    const segunda = await rtdb.getCuentaBot(phone);
    expect(primera).toMatchObject({ phone, seedbot: "claro-seed" });
    expect(segunda).toEqual(primera);
    expect(once).toHaveBeenCalledTimes(1);
  });

  it("bot inexistente (null) no se cachea", async () => {
    const phone = `52166${Date.now()}`;
    const once = vi.fn(async () => ({ exists: () => false, val: () => null }));
    const rtdb = new RealtimeDatabase({ ref: vi.fn(() => ({ once })) });
    expect(await rtdb.getCuentaBot(phone)).toBeNull();
    expect(await rtdb.getCuentaBot(phone)).toBeNull();
    expect(once).toHaveBeenCalledTimes(2);
  });
});
