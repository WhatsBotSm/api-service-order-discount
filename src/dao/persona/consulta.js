import { logger } from '../../../src/funciones/utilerias/logger.js';
import { getClient } from '../../../src/configuraciones/config.db.js';

export const getPersonaByPhone = async function (phone) {
    console.log("getPersonaByPhone", phone);
    let client;
    try {
        client = await getClient();

        const query = `SELECT id, name, patern, matern, status, address, phone, email,updated
        FROM agenda.persona WHERE phone = $1`;

        const resultado = await client.query(query, [phone]);
        client.release();

        return resultado.rows.length > 0 ? resultado.rows : [false];
    } catch (err) {
        if (client) client.release();
        logger.debug(err);
        console.log(err)
        return [false];
    }
}

export const getPersonaByPhoneCita = async function (idBot, phone) {
    console.log("getPersonaByPhone", phone);
    let client;
    try {
        client = await getClient();

        const query = `SELECT p.id, p.name, p.patern, p.matern, p.status, p.address, p.phone, p.email,p.updated
        FROM agenda.persona p INNER JOIN agenda.cita c ON c.phone=p.phone 
        WHERE p.phone = $1 and c.idbot=$2 and c.starttime BETWEEN  current_date-90 AND current_date limit 1`;

        const resultado = await client.query(query, [phone, idBot]);
        client.release();

        return resultado.rows.length > 0 ? resultado.rows : [false];
    } catch (err) {
        if (client) client.release();
        logger.debug(err);
        console.log(err)
        return [false];
    }
}