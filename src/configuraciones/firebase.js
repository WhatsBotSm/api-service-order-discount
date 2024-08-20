import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore';
import fs from 'fs';
const serviceAccount = JSON.parse(fs.readFileSync('./src/configuraciones/firebase/serviceAccountKey.json', 'utf8'));

initializeApp({
    credential: cert(serviceAccount) // Usa el archivo JSON para la autenticación
});

const fsdb = getFirestore();
// console.log(fsdb);

export { fsdb };