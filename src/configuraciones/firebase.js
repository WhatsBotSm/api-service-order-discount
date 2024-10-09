import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getDatabase } from 'firebase-admin/database';
import fs from 'fs';

const entorno = process.env.NODE_ENV;
const URL_RTDB = process.env.URL_RTDB;

let useCredentials = null;

switch (entorno) {
    case "stagedev":
        const serviceAccountDev = JSON.parse(fs.readFileSync('./src/configuraciones/firebase/serviceAccountKeyDev.json', 'utf8'));
        useCredentials = serviceAccountDev
        break
    case "stageqa":
        const serviceAccountQA = JSON.parse(fs.readFileSync('./src/configuraciones/firebase/serviceAccountKeyQA.json', 'utf8'));
        useCredentials = serviceAccountQA
        break
    default:
        const serviceAccount = JSON.parse(fs.readFileSync('./src/configuraciones/firebase/serviceAccountKey.json', 'utf8'));
        useCredentials = serviceAccount
        break
}

initializeApp({
    credential: cert(useCredentials), // Usa el archivo JSON para la autenticación
    databaseURL: URL_RTDB
});

const fsdb = getFirestore();
const rtdb = getDatabase();

export { fsdb, rtdb };