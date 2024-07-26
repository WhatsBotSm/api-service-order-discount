import { logger } from "../../funciones/utilerias/logger.js";
import { getClient } from "../../configuraciones/config.db.js";
import { queryInsertDesc } from './listaquery.js'

//insertar descuento
export const insertDescuento = async function (descuento) {
  const values = Object.values(descuento);//saca los valores del descuento enviado
  let descuen;//nueva variable
  try {
    descuen = await getClient();
    //insersion con sql para la bd, values valores a insertar
    const resultado = await descuen.query(queryInsertDesc, values);
    descuen.release();
    //devuelve los valores ingresados junto al id descuento
    return resultado.rowCount > 0 ? resultado.rows : [false];
  } catch (err) {//en caso de un error entra en el catch
    if (descuen) descuen.release();
    logger.debug(err);//registra el error
    return err;//devuelve el error
  }
};

//insertar los valores en la bitacora
export const insertBitDescu = async function (bitdesc) {
  const values = Object.values(bitdesc);//obtiene los valores de bitdesc
  let bitdes;
  try {
    bitdes = await getClient();
    //insercion en la bitacora de descuento
    const query = `INSERT INTO  orders_bot.bit_descuentos_bot (idbot ,id_descuento,action_desc, justy_change ,name_col ,lt_value,pt_value) VALUES
        ($1,$2,$3,$4,$5,$6,$7);`;
    //se almacenan los valores que se ingresaron a la bitacora
    const resultado = await bitdes.query(query, values);
    bitdes.release();
    return resultado.rowCout > 0;//devuelve el resultado junto a su id
  } catch (er) {//en caso de error entra en el catch
    if (bitdes) bitdes.release();
    logger.debug(er);
    return er;//devuleve el error
  }
};
