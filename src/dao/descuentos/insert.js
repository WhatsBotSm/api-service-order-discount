import { logger } from "../../funciones/utilerias/logger.js";
import { getClient } from "../../configuraciones/config.db.js";

export const insertDescuento = async function (pedido) {
  const values = Object.values(pedido);
  console.log("insertDescuento", values);
  let descuen;
  try {
    descuen = await getClient();

    const query = `INSERT INTO orders_bot.descuentos (id_client_admin_bot, idbot_control, nombre, descripcion, tipo_descuento, valor, fecha_inicio, fecha_fin, codigo) VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning id_descuento`;

    const resultado = await descuen.query(query, values);
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
