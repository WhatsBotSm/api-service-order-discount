// Servicio para Firestore
class Firestore {
    constructor(db, UseFirestore) {
        this.db = db;
        this.UseFirestore = UseFirestore;
    }

    async addDoc(collection, docId, doc) {
        try {
            if (this.UseFirestore == "false") return;

            // Validar que collection y docId no sean nulos o vacíos
            if (!collection || !docId) {
                throw new Error('Collection name and document ID must be non-empty strings.');
            }
            console.log('Collection:', collection);
            console.log('DocId:', docId);
            const docIdString = docId.toString();

            const docRef = this.db.collection(collection).doc(docIdString);
            console.log('Document Reference:', docRef.path);


            const docSnapshot = await docRef.get();
            if (docSnapshot.exists) {
                console.log('Document already exists');
                return docSnapshot.data();
            }

            let tmpDoc = { ...doc, docId };
            await docRef.set(tmpDoc);
            console.log('Doc added successfully');
            return tmpDoc;
        } catch (error) {
            console.error('Error adding Doc:', error);
            return;
        }
    }

    async getDocById(collection, docId) {
        console.log('getDocById', collection, docId);
        try {
            if (this.UseFirestore == "false") return;

            // Validar que collection y docId no sean nulos o vacíos
            if (!collection || !docId) {
                throw new Error('Collection name and document ID must be non-empty strings.');
            }
            console.log('Collection:', collection);
            console.log('DocId:', docId);
            const docIdString = docId.toString();
            const docRef = this.db.collection(collection).doc(docIdString);
            const docSnapshot = await docRef.get();
            if (docSnapshot.exists) {
                return docSnapshot.data();
            }
            return null;
        } catch (error) {
            console.error('Error getting Doc:', error);
            throw error;
        }
    }

    async updateDoc(collection, docId, newVsnDoc) {
        console.log('updateDoc', collection, docId, newVsnDoc);
        try {
            if (this.UseFirestore == "false") return;

            // Validar que collection y docId no sean nulos o vacíos
            if (!collection || !docId) {
                throw new Error('Collection name and document ID must be non-empty strings.');
            }
            console.log('Collection:', collection);
            console.log('DocId:', docId);
            const docIdString = docId.toString(); 
            const docRef = this.db.collection(collection).doc(docIdString);
            await docRef.update({ ...newVsnDoc, docId });
            console.log('Doc updated successfully');
            return newVsnDoc;
        } catch (error) {
            console.error('Error updating Doc:', error);
            throw error;
        }
    }

    // Método para realizar búsquedas compuestas
    async queryDocs(collection, conditions) {
        console.log('queryDocs', collection, conditions);
        try {
            if (this.UseFirestore == "false") return;
            
            let query = this.db.collection(collection);

            // Añadir condiciones a la consulta
            conditions.forEach(condition => {
                query = query.where(condition.field, condition.operator, condition.value);
            });

            const snapshot = await query.get();

            if (snapshot.empty) {
                console.log('No matching documents.');
                return [];
            }

            let results = [];
            snapshot.forEach(doc => {
                results.push(doc.data());
            });

            return results;
        } catch (error) {
            console.error('Error querying documents:', error);
            throw error;
        }
    }

    async deleteDoc(collection, docId) {
        console.log('deleteDoc', collection, docId);
        try {
            if (this.UseFirestore == "false") return;

            const docRef = this.db.collection(collection).doc(docId);
            await docRef.delete();
            console.log('Doc deleted successfully');
            return true;
        } catch (error) {
            console.error('Error deleting Doc:', error);
            throw error;
        }
    }
}

// Ejemplo de uso
// const firestoreService = new Firestore(fsdb);

// Condiciones de búsqueda
// const conditions = [
//     { field: 'name', operator: '==', value: 'Alice' },
//     { field: 'age', operator: '>=', value: 25 }
// ];

// firestoreService.queryDocs('users', conditions).then(results => {
//     console.log('Search results:', results);
// });

// Exportar instancia del servicio
export default Firestore;
