import { logger } from '../../funciones/utilerias/logger.js';
import { getClient } from '../../configuraciones/config.db.js';

export const updateDes = async function (cita) {
    delete cita.id;
    delete cita.updated;
    delete cita.created;
    delete cita.linkMeet;
    const values = Object.values(cita);
    // console.log("insertCita", values);
    let client;
    try {
        client = await getClient();
        const query = `UPDATE orders_bot.descuentos
        SET id_client_admin_bot=$2, idbot_control=$3, created=$4, updated=$5, nombre=$6, descripcion=$7, tipo_descuento=$8, valor=$9, fecha_inicio=$10, fecha_fin=$11, codigo=$12, id_producto=$13
        WHERE id_descuento=$1;`;

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