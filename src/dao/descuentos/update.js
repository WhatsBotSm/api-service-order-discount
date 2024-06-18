import { logger } from '../../funciones/utilerias/logger.js';
import { getClient } from '../../configuraciones/config.db.js';

export const updateDes = async function (cita) {
    const values = Object.values(cita);
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
        codigo=$10
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