import { logger } from '../../../src/funciones/utilerias/logger.js';
import { getClient } from '../../../src/configuraciones/config.db.js';

export const updateCita = async function (cita) {
    delete cita.id;
    delete cita.updated;
    delete cita.created;
    delete cita.linkMeet;
    const values = Object.values(cita);
    // console.log("insertCita", values);
    let client;
    try {
        client = await getClient();
        const query = `UPDATE agenda.cita SET
        updated=CURRENT_TIMESTAMP, status=$3 ,title=$4,location=$5,starttime=$6,endtime=$7 
        WHERE idbot=$1 and  uuidgl=$2`;

        const resultado = await client.query(query, values);
        client.release();

        return resultado.rowCount > 0;

    } catch (err) {
        if (client) client.release();
        logger.debug(err);
        console.log(err)
        return err;
    }
}

export const changeStatus = async function (status, id, idBot) {
    // console.log("completeCita", id);
    let client;
    try {
        client = await getClient();
        const query = `UPDATE agenda.cita SET status=$1 WHERE id=$2 and idbot =$3`;

        const resultado = await client.query(query, [status, id, idBot]);
        client.release();

        return resultado.rowCount > 0;

    } catch (err) {
        if (client) client.release();
        logger.debug(err);
        console.log(err)
        return err;
    }
}