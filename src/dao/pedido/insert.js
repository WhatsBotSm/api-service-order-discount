import { logger } from '../../../src/funciones/utilerias/logger.js';
import { getClient } from '../../../src/configuraciones/config.db.js';

export const insertPedido = async function (pedido) {
    const values = Object.values(pedido);
    console.log("insertCita", values);
    let client;
    try {
        client = await getClient();

        const query = `INSERT INTO adm_ac.catperfiles (idcatperfil, perfil, isactive, createdon,createdby, modifiedon, modifiedby) VALUES
        ($1,$2,$3,$4,$5,$6,$7)`;

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

export const insertDetallePedido = async function (detallePedido) {
    const values = Object.values(detallePedido);
    console.log("insertDetallePedido", values);
    let client;
    try {
        client = await getClient();

        const query = `INSERT INTO orders_bot.detalle_pedido(id_pedido, status, id_tipo_ped, id_cat_prod)
        VALUES ($1,$2,$3,$4)`;

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