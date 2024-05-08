import { logger } from '../../../src/funciones/utilerias/logger.js';
import { getClient } from '../../../src/configuraciones/config.db.js';

export const updatePerson = async function (phone, col, val) {
    // logger.info("updatePerson: " + phone, col, val);
    let client;
    let resultado;
    try {
        const cols = ['name', 'patern', 'matern', 'status', 'address', 'phone', 'email'];
        if (cols.includes(col)) {
            client = await getClient();
            const query = `UPDATE agenda.persona SET ${col}=$2, updated = CURRENT_TIMESTAMP WHERE phone = $1`;

            resultado = await client.query(query, [phone, val]);
            client.release();
        }
        return resultado.rows.length > 0 ? resultado.rows : false;
    } catch (err) {
        if (client) client.release();
        logger.debug(err);
        console.log(err)
        return err;
    }
}