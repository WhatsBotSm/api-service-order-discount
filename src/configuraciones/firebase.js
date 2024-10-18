import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getDatabase } from 'firebase-admin/database';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';

let useCredentials = null;
const entorno = process.env.NODE_ENV;

switch (entorno) {
    case 'stagedev':
        const serviceAccountDev = JSON.parse(fs.readFileSync('./src/configuraciones/firebase/serviceAccountDev.json', 'utf8'));
        useCredentials = serviceAccountDev;
        break;
    case 'stageqa':
        const serviceAccountQa = JSON.parse(fs.readFileSync('./src/configuraciones/firebase/serviceAccountQa.json', 'utf8'));
        useCredentials = serviceAccountQa
        break;
    case 'stageuat':
        const serviceAccountUat = JSON.parse(fs.readFileSync('./src/configuraciones/firebase/serviceAccountUat.json', 'utf8'));
        useCredentials = serviceAccountUat
        break;
    default:
        const serviceAccount = JSON.parse(fs.readFileSync('./src/configuraciones/firebase/serviceAccountKey.json', 'utf8'));
        useCredentials = serviceAccount;
}

initializeApp({
    credential: cert(useCredentials.SDK),
    databaseURL: useCredentials.RTDB
});

const fsdb = getFirestore();
const rtdb = getDatabase();
const auth = getAuth();

export { fsdb, rtdb, auth };