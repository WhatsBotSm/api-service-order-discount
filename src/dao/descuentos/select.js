import { logger } from "../../funciones/utilerias/logger.js";
import { getClient } from "../../configuraciones/config.db.js";

export const getByIdDes = async function (id_descuento) {
  console.log("getPedidoById", id_descuento);
  let descuen;
  try {
    descuen = await getClient();

    const query = `SELECT id_descuento, id_client_admin_bot, idbot_control, created, updated, nombre, descripcion, tipo_descuento, valor, fecha_inicio, fecha_fin, codigo
    FROM orders_bot.descuentos
    where id_descuento = $1;`;

    const resultado = await descuen.query(query, [id_descuento]);
    descuen.release();

    return resultado.rows.length > 0 ? resultado.rows : [false];
  } catch (err) {
    if (descuen) descuen.release();
    logger.debug(err);
    console.log(err);
    return err;
  }
};
export const getDesByIdBot = async function (id_descuento) {
  console.log("getPedidoById", id_descuento);
  let descuen;
  try {
    descuen = await getClient();

    const query = `SELECT id_descuento, id_client_admin_bot, idbot_control, created, updated, nombre, descripcion, tipo_descuento, valor, fecha_inicio, fecha_fin, codigo
    FROM orders_bot.descuentos
    where idbot_control = $1;`;

    const resultado = await descuen.query(query, [id_descuento]);
    descuen.release();

    return resultado.rows.length > 0 ? resultado.rows : [false];
  } catch (err) {
    if (descuen) descuen.release();
    logger.debug(err);
    console.log(err);
    return err;
  }
};
export const getTodoDes = async function () {
  let descuen;
  try {
    descuen = await getClient();

    const query = `SELECT * FROM orders_bot.descuentos order by id_descuento asc where idbot_control = $1;`;

    const resultado = await descuen.query(query);
    descuen.release();

    return resultado.rows.length > 0 ? resultado.rows : [false];
  } catch (err) {
    if (descuen) descuen.release();
    logger.debug(err);
    console.log(err);
    return err;
  }
};

export const getDescuentosPaginados = async (idbot,startIndex, pageSize) => {
  let client;
  try {
    client = await getClient();
    const query = `SELECT * FROM orders_bot.descuentos WHERE idbot_control = $1 ORDER BY id_descuento ASC LIMIT $2 OFFSET $3;`;
    const resultado = await client.query(query, [idbot,pageSize, startIndex]);
    client.release();
    return resultado.rows;
  } catch (err) {
    if (client) client.release();
    logger.debug(err);
    console.log(err);
    return err;
  }
};

export const getTotalDescuentos = async (idbot) => {
  let client;
  try {
    client = await getClient();
    const query = `SELECT COUNT(*) FROM orders_bot.descuentos `;
    const resultado = await client.query(query,[idbot]);
    client.release();
    return parseInt(resultado.rows[0].count);
  } catch (err) {
    if (client) client.release();
    logger.debug(err);
    console.log(err);
    return err;
  }
};

export const getDescuent = async function (id_descuento) {
  console.log("getDescuent", id_descuento);
  let descuen;
  try {
    descuen = await getClient();

    const query = `SELECT nombre, descripcion, tipo_descuento, valor, codigo
    FROM orders_bot.descuentos
    where id_descuento = $1;`;

    const resultado = await descuen.query(query, [id_descuento]);
    descuen.release();

    return resultado.rows.length > 0 ? resultado.rows : [false];
  } catch (err) {
    if (descuen) descuen.release();
    logger.debug(err);
    console.log(err);
    return err;
  }
};