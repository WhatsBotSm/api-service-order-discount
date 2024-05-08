import { logger } from '../../funciones/utilerias/logger.js';
import { getClient } from '../../configuraciones/config.db.js';

export const getPedidoById = async function (id_descuento) {
  console.log("getPedidoById", id_descuento);
  let client;
  try {
    client = await getClient();

    const query = `SELECT id_descuento, id_client_admin_bot, idbot_control, created, updated, nombre, descripcion, tipo_descuento, valor, fecha_inicio, fecha_fin, codigo, id_producto
    FROM orders_bot.descuentos
    where id_descuento = $1;`;

    const resultado = await client.query(query, [id_descuento]);
    client.release();

    return resultado.rows.length > 0 ? resultado.rows : [false];
  } catch (err) {
    if (client) client.release();
    logger.debug(err);
    console.log(err)
    return err;
  }
}
export const getPedidoByIdSus = async function (id_descuento) {
  console.log("getPedidoById", id_descuento);
  let client;
  try {
    client = await getClient();

    const query = `SELECT id_descuento, id_client_admin_bot, idbot_control, created, updated, nombre, descripcion, tipo_descuento, valor, fecha_inicio, fecha_fin, codigo, id_producto
    FROM orders_bot.descuentos
    where id_descuento = $1;`;

    const resultado = await client.query(query, [id_descuento]);
    client.release();

    return resultado.rows.length > 0 ? resultado.rows : [false];
  } catch (err) {
    if (client) client.release();
    logger.debug(err);
    console.log(err)
    return err;
  }
}
export const getPedidoByIdPag = async function (id_descuento) {
  console.log("getPedidoById", id_descuento);
  let client;
  try {
    client = await getClient();

    const query = `SELECT id_descuento, id_client_admin_bot, idbot_control, created, updated, nombre, descripcion, tipo_descuento, valor, fecha_inicio, fecha_fin, codigo, id_producto
    FROM orders_bot.descuentos
    where id_descuento = $1;`;

    const resultado = await client.query(query, [id_descuento]);
    client.release();

    return resultado.rows.length > 0 ? resultado.rows : [false];
  } catch (err) {
    if (client) client.release();
    logger.debug(err);
    console.log(err)
    return err;
  }
}