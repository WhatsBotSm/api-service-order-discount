import { logger } from '../../../src/funciones/utilerias/logger.js';
import { getClient } from '../../../src/configuraciones/config.db.js';

export const insertPhone = async function (phone) {
    let client;
    try {
        client = await getClient();

        const query = `INSERT INTO agenda.persona (phone) VALUES ($1) 
        ON CONFLICT (phone) DO update SET phone = excluded.phone, updated = CURRENT_TIMESTAMP`;
        const resultado = await client.query(query, [phone]);
        client.release();

        return resultado.rowCount > 0;

    } catch (err) {
        if (client) client.release();
        logger.debug(err);
        console.log(err)
        return err;
    }
}