import { fsdb } from '../configuraciones/firebase.js';
import Firestore from "../funciones/firebase/firestore.js";

const firestoreService = new Firestore(fsdb);

export const firestoreInstance = async (req, res, next) => {
    req.fsdb = firestoreService;
    next();
};