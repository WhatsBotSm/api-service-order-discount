const STORE_BOT = process.env.STORE_BOT || "STORE_BOT";
import { aclaraText, ofuscaText } from "../utilerias/RSABot.js";
class RealtimeDatabase {
    constructor(db, useRealtimeDB = true) {
        this.db = db;
        this.useRealtimeDB = useRealtimeDB;
    }

    async addDoc(collection, docId, doc) {
        try {
            if (this.useRealtimeDB === "false") return;
            if (!collection || !docId) {
                throw new Error('El nombre de la colección y el ID del documento deben ser cadenas no vacías.');
            }
            // console.log('Collection:', collection);
            // console.log('DocId:', docId);

            const path = `${collection}/${docId}`;
            const ref = this.db.ref(path);

            const snapshot = await ref.once('value');
            let tmpDoc = { ...doc, docId };
            if (snapshot.exists()) {
                // console.log('El documento ya existe');
                let rs = snapshot.val();
                tmpDoc = { ...tmpDoc, ...rs };
            }

            await ref.set(tmpDoc);
            // console.log('Documento agregado exitosamente');
            return tmpDoc;
        } catch (error) {
            console.error('Error al agregar el documento:', error);
            return;
        }
    }

    async getDocById(collection, docId) {
        // console.log('getDocById', collection, docId);
        try {
            if (this.useRealtimeDB === "false") return;
            if (!collection || !docId) {
                throw new Error('El nombre de la colección y el ID del documento deben ser cadenas no vacías.');
            }
            // console.log('Collection:', collection);
            // console.log('DocId:', docId);

            const path = `${collection}/${docId}`;
            const ref = this.db.ref(path);

            const snapshot = await ref.once('value');
            if (snapshot.exists()) {
                return snapshot.val();
            }
            return null;
        } catch (error) {
            console.error('Error al obtener el documento:', error);
            throw error;
        }
    }

    async getkeysRSA(docId) {
        try {
            const path = `${STORE_BOT}/KEY_BOT/${ofuscaText(`R54K3YS.${docId}`)}`;
            const ref = this.db.ref(path);
            // console.log('path:', path);
            const snapshot = await ref.once('value');
            if (snapshot.exists()) {
                return snapshot.val();
            }
            return null;
        } catch (error) {
            console.error('Error al obtener el documento:', error);
            throw error;
        }
    }
    async getCuentaBot(docId) {
        try {
            const path = `CONFIGBOT/${ofuscaText(`CNFGBT.${docId}`)}`;
            const ref = this.db.ref(path);
            // console.log('path:', path);
            const snapshot = await ref.once('value');
            if (snapshot.exists()) {
                let conf = snapshot.val();
                conf.cuenta.seedbot = aclaraText(conf.cuenta.seedbot)
                return conf.cuenta;
            }
            return null;
        } catch (error) {
            console.error('Error al obtener el documento:', error);
            throw error;
        }
    }

    async updateDoc(collection, docId, newVsnDoc) {
        // console.log('updateDoc', collection, docId, newVsnDoc);
        try {
            if (this.useRealtimeDB === "false") return;
            if (!collection || !docId) {
                throw new Error('El nombre de la colección y el ID del documento deben ser cadenas no vacías.');
            }
            // console.log('Collection:', collection);
            // console.log('DocId:', docId);

            const path = `${collection}/${docId}`;
            const ref = this.db.ref(path);

            await ref.update({ ...newVsnDoc, docId });
            // console.log('Documento actualizado exitosamente');
            return newVsnDoc;
        } catch (error) {
            console.error('Error al actualizar el documento:', error);
            throw error;
        }
    }

    async deleteDoc(collection, docId) {
        // console.log('deleteDoc', collection, docId);
        try {
            if (this.useRealtimeDB === "false") return;
            const path = `${collection}/${docId}`;
            const ref = this.db.ref(path);

            await ref.remove();
            // console.log('Documento eliminado exitosamente');
            return true;
        } catch (error) {
            console.error('Error al eliminar el documento:', error);
            throw error;
        }
    }
}

export default RealtimeDatabase;
