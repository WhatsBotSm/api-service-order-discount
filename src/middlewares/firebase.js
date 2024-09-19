import { fsdb } from '../configuraciones/firebase.js';
import Firestore from "../funciones/firebase/firestore.js";
const UseFirestore = process.env.USEFIRESTORE;

const firestoreService = new Firestore(fsdb, UseFirestore);

export const firestoreInstance = async (req, res, next) => {
    req.fsdb = firestoreService;
    next();
};