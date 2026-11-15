import { describe, it, expect, vi } from "vitest";
import Firestore from "../src/funciones/firebase/firestore.js";

// db mínimo: un solo docRef con create/get/set espiados
const crearDb = ({ existente } = {}) => {
  const docRef = {
    path: "col/1",
    create: vi.fn(async () => {
      if (existente) throw Object.assign(new Error("6 ALREADY_EXISTS: Document already exists"), { code: 6 });
    }),
    get: vi.fn(async () => ({ exists: Boolean(existente), data: () => existente })),
    set: vi.fn(async () => undefined)
  };
  return { docRef, db: { collection: vi.fn(() => ({ doc: vi.fn(() => docRef) })) } };
};

describe("Firestore.addDoc sin lectura previa", () => {
  it("doc nuevo: una sola escritura (create), sin get", async () => {
    const { db, docRef } = crearDb();
    const fs = new Firestore(db, "true");
    const res = await fs.addDoc(`col_${Date.now()}`, 1, { a: 1 });
    expect(res).toEqual({ a: 1, docId: 1 });
    expect(docRef.create).toHaveBeenCalledWith({ a: 1, docId: 1 });
    expect(docRef.get).not.toHaveBeenCalled();
    expect(docRef.set).not.toHaveBeenCalled();
  });

  it("doc existente: no lo sobreescribe y devuelve el existente (mismo contrato)", async () => {
    const { db, docRef } = crearDb({ existente: { a: 0, docId: 1 } });
    const fs = new Firestore(db, "true");
    const res = await fs.addDoc(`col_${Date.now()}_e`, 1, { a: 1 });
    expect(res).toEqual({ a: 0, docId: 1 });
    expect(docRef.get).toHaveBeenCalledTimes(1);
    expect(docRef.set).not.toHaveBeenCalled();
  });
});
