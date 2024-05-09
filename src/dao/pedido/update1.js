import { logger } from '../../funciones/utilerias/logger.js';
import { getClient } from '../../configuraciones/config.db.js';

export const updateDes = async function (cita) {
    /*delete cita.id;
    delete cita.updated;
    delete cita.created;
    delete cita.linkMeet;*/
    const values = Object.values(cita);
    // console.log("insertCita", values);
    let client;
    try {
        client = await getClient();
        const query = `UPDATE orders_bot.descuentos
        SET  
        id_client_admin_bot=$2,
        idbot_control=$3,
        updated=CURRENT_TIMESTAMP,
        nombre=$4,
        descripcion=$5,
        tipo_descuento=$6,
        valor=$7,
        fecha_inicio=$8,
        fecha_fin=$9,
        codigo=$10,
        id_producto=$11
        WHERE id_descuento=$1`;

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
export const updateSus = async function (cita) {
    /*delete cita.id;
    delete cita.updated;
    delete cita.created;
    delete cita.linkMeet;*/
    const values = Object.values(cita);
    // console.log("insertCita", values);
    let client;
    try {
        client = await getClient();
        const query = `UPDATE orders_bot.suscripciones_bot
        SET id_client_admin_bot=$2, idbot_suscr=$3, id_prod_suscr=$4, id_paqu_suscr=$5, phone_suscr=$6, status_suscr=$7, comision=$8, descuento_id=$9, updated=CURRENT_TIMESTAMP
        WHERE id_suscripcion=$1;`;

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
export const updatePag = async function (cita) {
    /*delete cita.id;
    delete cita.updated;
    delete cita.created;
    delete cita.linkMeet;*/
    const values = Object.values(cita);
    // console.log("insertCita", values);
    let client;
    try {
        client = await getClient();
        const query = `UPDATE orders_bot.pagos_suscr_bot
        SET id_suscripcion_bot=$2, folio=$3, fecha_pago=$4, concepto=$5, referencia=$6, cantidad_pago=$7, comision=$8, updated=CURRENT_TIMESTAMP
        WHERE id_pago_suscr=$1;`;

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