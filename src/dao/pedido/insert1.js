import { logger } from '../../funciones/utilerias/logger.js';
import { getClient } from '../../configuraciones/config.db.js';

/************************************************* */
export const insertPago = async function (pedido) {
    const values = Object.values(pedido);
    console.log("insertCita", values);
    let client;
    try {
        client = await getClient();

        const query = `INSERT INTO orders_bot.pagos_suscr_bot ( id_suscripcion_bot, folio, fecha_pago, concepto, referencia, cantidad_pago, comision, created, updated) VALUES
        ($1,$2,$3,$4,$5,$6,$7,CURRENT_TIMESTAMP,$8)`;

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
export const insertSuscripcion = async function (pedido) {
    const values = Object.values(pedido);
    console.log("insertCita", values);
    let client;
    try {
        client = await getClient();

        const query = `INSERT INTO orders_bot.suscripciones_bot (id_client_admin_bot, idbot_suscr, id_prod_suscr, id_paqu_suscr, phone_suscr, status_suscr, comision, descuento_id, created, updated) VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_TIMESTAMP,$9)`;

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
export const insertDescuento = async function (pedido) {
    const values = Object.values(pedido);
    console.log("insertCita", values);
    let client;
    try {
        client = await getClient();

        const query = `INSERT INTO orders_bot.descuentos (id_descuento, id_client_admin_bot, idbot_control, created, updated, nombre, descripcion, tipo_descuento, valor, fecha_inicio, fecha_fin, codigo, id_producto) VALUES
        ($1,$2,$3,CURRENT_TIMESTAMP,$4,$5,$6,$7,$8,$9,$10,$11,$12)`;

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
/***************************** */