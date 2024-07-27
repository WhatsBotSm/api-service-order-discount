import { logger } from "../../funciones/utilerias/logger.js";
import { getClient } from "../../configuraciones/config.db.js";
import { queryInsertDesc } from './listaquery.js'

export const insertDescuento = async function (descuento) {
  const values = Object.values(descuento);
  console.log("insertDescuento", values);
  let descuen;
  try {
    descuen = await getClient();

    const resultado = await descuen.query(queryInsertDesc, values);
    descuen.release();

    return resultado.rowCount > 0 ? resultado.rows : [false];
  } catch (err) {
    if (descuen) descuen.release();
    logger.debug(err);
    console.log(err);
    return err;
  }
};

export const insertBitDescu = async function (bitdesc) {
  const values = Object.values(bitdesc);
  console.log("insertbitDescu", values);
  let bitdes;

  try {
    bitdes = await getClient();

    const query = `INSERT INTO  orders_bot.bit_descuentos_bot (idbot ,id_descuento,action_desc, justy_change ,name_col ,lt_value,pt_value) VALUES
        ($1,$2,$3,$4,$5,$6,$7);`;
    const resultado = await bitdes.query(query, values);
    bitdes.release();
    return resultado.rowCout > 0;
  } catch (er) {
    if (bitdes) bitdes.release();
    logger.debug(er);
    console.log(er);
    return er;
  }
};
