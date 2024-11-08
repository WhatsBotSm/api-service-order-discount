import { logger } from '../../src/funciones/utilerias/logger.js';
import { getClient } from '../../src/configuraciones/config.db.js';

export const getConfigBotById = async function (Id) {
    let client;
    try {
        client = await getClient();

        const query = `SELECT idbot, namebot, passbot, seedbot, tokenbot, status, address, phone, email, updated
        FROM adminchat.configbot WHERE idbot = $1`;

        const resultado = await client.query(query, [Id]);
        client.release();

        return resultado.rows.length > 0 ? resultado.rows : [false];
    } catch (err) {
        if (client) client.release();
        logger.debug(err);
        logger.error(err)
        return [false];
    }
}