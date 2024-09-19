import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore';
import fs from 'fs';
const serviceAccount = JSON.parse(fs.readFileSync('./src/configuraciones/firebase/serviceAccountKey.json', 'utf8'));
const serviceAccountDev = JSON.parse(fs.readFileSync('./src/configuraciones/firebase/serviceAccountKeyDev.json', 'utf8'));
const serviceAccountQA = JSON.parse(fs.readFileSync('./src/configuraciones/firebase/serviceAccountKeyQA.json', 'utf8'));

const entorno = process.env.NODE_ENV;

let useCredentials = null;

switch (entorno) {
    case "stagedev":
        useCredentials = serviceAccountDev
        break
    case "stageqa":
        useCredentials = serviceAccountQA
        break
    default:
        useCredentials = serviceAccount
        break
}

initializeApp({
    credential: cert(useCredentials) // Usa el archivo JSON para la autenticación
});

const fsdb = getFirestore();
// console.log(fsdb);

export { fsdb };