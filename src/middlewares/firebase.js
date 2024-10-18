import { fsdb, rtdb } from '../configuraciones/firebase.js';
import RealtimeDatabase from "../funciones/firebase/realTimeDB.js";
import Firestore from "../funciones/firebase/firestore.js";

const UseFirestore = process.env.USEFIRESTORE;
const firestoreService = new Firestore(fsdb, UseFirestore);
const realTimeDBService = new RealtimeDatabase(rtdb);

export const firestoreInstance = async (req, res, next) => {
    req.fsdb = firestoreService;
    req.rtdb = realTimeDBService;
    next();
};