import { logger } from '../../funciones/utilerias/logger.js';
import { getClient } from '../../configuraciones/config.db.js';

export const insertDescuento = async function (pedido) {
    const values = Object.values(pedido);
    console.log("insertCita", values);
    let client;
    try {
        client = await getClient();

        const query = `INSERT INTO orders_bot.descuentos (id_client_admin_bot, idbot_control, nombre, descripcion, tipo_descuento, valor, fecha_inicio, fecha_fin, codigo) VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning id_descuento`;

        const resultado = await client.query(query, values);
        client.release();

        return resultado.rowCount > 0 ? resultado.rows : [false];

    } catch (err) {
        if (client) client.release();
        logger.debug(err);
        console.log(err)
        return err;
    }
}