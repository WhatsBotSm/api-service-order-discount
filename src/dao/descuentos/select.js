import { logger } from "../../funciones/utilerias/logger.js";
import { getClient } from "../../configuraciones/config.db.js";
import { selColumnsDescByBot, selColumnsDesc, selColumnsDescPaguinado,ftSearchTerm,ftType,ftStartDate,ftEndDate,ftOffsetDes } from './listaquery.js'

export const getByIdDes = async function (id_descuento) {
  console.log("getPedidoById", id_descuento);
  let descuen;
  try {
    descuen = await getClient();

    const resultado = await descuen.query(selColumnsDesc, [id_descuento]);
    descuen.release();

    return resultado.rows.length > 0 ? resultado.rows : [false];
  } catch (err) {
    if (descuen) descuen.release();
    logger.debug(err);
    console.log(err);
    return err;
  }
};
export const getDesByIdBot = async function (id_bot) {
  console.log("getPedidoById", id_bot);
  let descuen;
  try {
    descuen = await getClient();

    const resultado = await descuen.query(selColumnsDescByBot, [id_bot]);
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

    const query = `SELECT * FROM orders_bot.descuentos order by id_descuento asc;`;

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

// export const getDescuentosPaginados = async (idbot, startIndex, pageSize, searchTerm, filterType, startDate, endDate) => {
//   let client;
//   try {
//     client = await getClient();
//     let query = selColumnsDescByBot;
//     let params = [idbot];
//     let paramIndex = 2;

//     if (searchTerm) {
//       query += ` AND (nombre ILIKE $${paramIndex} OR descripcion ILIKE $${paramIndex})`;
//       params.push(`%${searchTerm}%`);
//       paramIndex++;
//     }
//     if (filterType) {
//       query += ` AND tipo_descuento = $${paramIndex}`;
//       params.push(filterType);
//       paramIndex++;
//     }
//     if (startDate) {
//       query += ` AND fecha_inicio >= $${paramIndex}`;
//       params.push(startDate);
//       paramIndex++;
//     }
//     if (endDate) {
//       query += ` AND fecha_fin <= $${paramIndex}`;
//       params.push(endDate);
//       paramIndex++;
//     }

//     query += ` ORDER BY id_descuento ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
//     params.push(pageSize, startIndex);

//     const resultado = await client.query(query, params);
//     client.release();
//     return resultado.rows;
//   } catch (err) {
//     if (client) client.release();
//     logger.debug(err);
//     console.log(err);
//     return err;
//   }
// };

export const getDescuentosPaginados = async (idbot, startIndex, pageSize, searchTerm, filterType, startDate, endDate) => {
  let client;
  try {
    client = await getClient();
    let contador = selColumnsDescPaguinado;
    let query = selColumnsDescByBot;
    let params = [idbot];
    let paramsCount = [idbot];
    let paramIndex = 2; 

    if (searchTerm) {
      const filter = ftSearchTerm(paramIndex);
      query += filter;
      contador += filter;
      params.push(`%${searchTerm}%`);
      paramsCount.push(`%${searchTerm}%`);
      paramIndex++;
    }
    if (filterType) {
      const filter = ftType(paramIndex);
      query += filter;
      contador += filter;
      params.push(filterType);
      paramsCount.push(filterType);
      paramIndex++;
    }
    if (startDate) {
      const filter = ftStartDate(paramIndex);
      query += filter;
      contador += filter;
      params.push(startDate);
      paramsCount.push(startDate);
      paramIndex++;
    }
    if (endDate) {
      const filter = ftEndDate(paramIndex);
      query += filter;
      contador += filter;
      params.push(endDate);
      paramsCount.push(endDate);
      paramIndex++;
    }

    query += ftOffsetDes(paramIndex);
    params.push(pageSize, startIndex);

    const resultadoTotal = await client.query(contador, paramsCount);
    let resultCount = resultadoTotal.rows.length > 0 ? resultadoTotal.rows[0].totalrows : 0;

    const resultado = await client.query(query, params);
    client.release();

    return resultado.rows.length > 0 
      ? { rows: resultado.rows, Total: resultCount }
      : { rows: [], Total: 0 };

  } catch (err) {
    if (client) client.release();
    console.log(err);
    return err;
  }
};

// export const getTotalDescuentos = async (idbot, searchTerm, filterType, startDate, endDate) => {
//   let client;
//   try {
//     client = await getClient();
//     let query = selColumnsDescPaguinado;
//     let params = [idbot];
//     let paramIndex = 2;

//     if (searchTerm) {
//       query += ` AND (nombre ILIKE $${paramIndex} OR descripcion ILIKE $${paramIndex})`;
//       params.push(`%${searchTerm}%`);
//       paramIndex++;
//     }
//     if (filterType) {
//       query += ` AND tipo_descuento = $${paramIndex}`;
//       params.push(filterType);
//       paramIndex++;
//     }
//     if (startDate) {
//       query += ` AND fecha_inicio >= $${paramIndex}`;
//       params.push(startDate);
//       paramIndex++;
//     }
//     if (endDate) {
//       query += ` AND fecha_fin <= $${paramIndex}`;
//       params.push(endDate);
//       paramIndex++;
//     }

//     const resultado = await client.query(query, params);
//     client.release();
//     return parseInt(resultado.rows[0].count);
//   } catch (err) {
//     if (client) client.release();
//     logger.debug(err);
//     console.log(err);
//     return err;
//   }
// };

export const getTotalDescuentos = async (idbot, searchTerm, filterType, startDate, endDate) => {
  let client;
  try {
    client = await getClient();
    let query = selColumnsDescPaguinado;
    let params = [idbot];
    let paramIndex = 2;

    if (searchTerm) {
      query += ftSearchTerm(paramIndex);
      params.push(`%${searchTerm}%`);
      paramIndex++;
    }
    if (filterType) {
      query += ftType(paramIndex);
      params.push(filterType);
      paramIndex++;
    }
    if (startDate) {
      query += ftStartDate(paramIndex);
      params.push(startDate);
      paramIndex++;
    }
    if (endDate) {
      query += ftEndDate(paramIndex);
      params.push(endDate);
      paramIndex++;
    }

    const resultado = await client.query(query, params);
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