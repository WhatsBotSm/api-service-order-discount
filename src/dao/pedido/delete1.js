import { logger } from '../../funciones/utilerias/logger.js';
import { getClient } from '../../configuraciones/config.db.js';

export const delByIdDes = async function (id_descuento) {
  console.log("getPedidoById", id_descuento);
  let client;
  try {
    client = await getClient();

    const query = `DELETE      FROM orders_bot.descuentos
    where id_descuento = $1;`;

    const resultado = await client.query(query, [id_descuento]);
    client.release();

    return resultado.rows.length > 0 ? resultado.rows : [true];
  } catch (err) {
    if (client) client.release();
    logger.debug(err);
    console.log(err)
    return err;
  }
}
export const delByIdSus = async function (id_suscripcion) {
  console.log("getPedidoByIdSus", id_suscripcion);
  let client;
  try {
    client = await getClient();

    const query = `DELETE 
    FROM orders_bot.suscripciones_bot
    where id_suscripcion = $1;`;

    const resultado = await client.query(query, [id_suscripcion]);
    client.release();

    return resultado.rows.length > 0 ? resultado.rows : [true];
  } catch (err) {
    if (client) client.release();
    logger.debug(err);
    console.log(err)
    return err;
  }
}
export const delByIdPag = async function (id_pago_suscr) {
  console.log("getPedidoByIdPag", id_pago_suscr);
  let client;
  try {
    client = await getClient();

    const query = `DELETE 
    FROM orders_bot.pagos_suscr_bot
    where id_pago_suscr = $1`;

    const resultado = await client.query(query, [id_pago_suscr]);
    client.release();

    return resultado.rows.length > 0 ? resultado.rows : [true];
  } catch (err) {
    if (client) client.release();
    logger.debug(err);
    console.log(err)
    return err;
  }
}