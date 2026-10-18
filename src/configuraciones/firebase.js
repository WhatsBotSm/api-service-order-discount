/* eslint-disable node/no-missing-import */
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getDatabase } from "firebase-admin/database";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";

// Cuenta de servicio desde Vault: FIREBASE_SA_JSON (contenido) o FIREBASE_SA_PATH (archivo
// montado), con o sin el envoltorio { SDK, RTDB }; la URL de RTDB sale de URL_RTDB si no viene.
// Sin ellas se usa el JSON versionado por entorno, como antes (sacarlo del repo: ver
// archive-doc-whtsbt/architecture/vault-inventario-mvp1.md §2.1).
const credencialesEntorno = () => {
  const raw = process.env.FIREBASE_SA_JSON || (process.env.FIREBASE_SA_PATH ? fs.readFileSync(process.env.FIREBASE_SA_PATH, "utf8") : "");
  if (!raw) return null;
  const sa = JSON.parse(raw);
  return { SDK: sa.SDK || sa, RTDB: sa.RTDB || process.env.URL_RTDB };
};

let useCredentials = credencialesEntorno();
const entorno = process.env.NODE_ENV;

switch (useCredentials ? "entorno" : entorno) {
  case "entorno":
    break;
  case "stagedev": {
    const serviceAccountDev = JSON.parse(fs.readFileSync("./src/configuraciones/firebase/serviceAccountDev.json", "utf8"));
    useCredentials = serviceAccountDev;
    break;
  }
  case "stageqa": {
    const serviceAccountQa = JSON.parse(fs.readFileSync("./src/configuraciones/firebase/serviceAccountQa.json", "utf8"));
    useCredentials = serviceAccountQa;
    break;
  }
  case "stageuat": {
    const serviceAccountUat = JSON.parse(fs.readFileSync("./src/configuraciones/firebase/serviceAccountUat.json", "utf8"));
    useCredentials = serviceAccountUat;
    break;
  }
  default: {
    const serviceAccount = JSON.parse(fs.readFileSync("./src/configuraciones/firebase/serviceAccountKey.json", "utf8"));
    useCredentials = serviceAccount;
  }
}

initializeApp({
  credential: cert(useCredentials.SDK),
  databaseURL: useCredentials.RTDB
});

const fsdb = getFirestore();
const rtdb = getDatabase();
const auth = getAuth();

export { fsdb, rtdb, auth };
