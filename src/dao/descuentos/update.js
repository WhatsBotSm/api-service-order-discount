import { logger } from "../../funciones/utilerias/logger.js";
import { getClient } from "../../configuraciones/config.db.js";
import { updColumnsDesc } from "./listaquery.js";

export const updateDes = async function (descuento) {
  let client;
  try {
    client = await getClient();
    let templateDesc = {
      id_client_admin_bot: descuento.id_client_admin_bot,
      idbot_control: descuento.idbot_control,
      nombre: descuento.nombre,
      descripcion: descuento.descripcion,
      tipo_descuento: descuento.tipo_descuento,
      valor: descuento.valor,
      fecha_inicio: descuento.fecha_inicio || new Date(),
      fecha_fin: descuento.fecha_fin || new Date(),
      codigo: descuento.codigo
    };
    const values = Object.values(templateDesc);
    values.push(descuento.id_descuento);

    const resultado = await client.query(updColumnsDesc, values);
    client.release();

    return resultado.rowCount > 0;
  } catch (err) {
    if (client) client.release();
    logger.debug(err);
    console.log("Error", err);
    return err;
  }
};
