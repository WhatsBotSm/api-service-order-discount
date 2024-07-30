import { logger } from "../../funciones/utilerias/logger.js";
import { getClient } from "../../configuraciones/config.db.js";
import { updColumnsDesc } from "./listaquery.js";

//actualizar descuento
export const updateDes = async function (descuento) {
  let client;
  try {
    client = await getClient();
    //objeto con los valores que se cambiaran
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
    //extrae los valores y los almacena
    const values = Object.values(templateDesc);
    values.push(descuento.id_descuento);//mete el id_descuento al objeto
    //consulta sql para actualizar descuento
    const resultado = await client.query(updColumnsDesc, values);
    client.release();
    //resultado de la actualizacion
    return resultado.rowCount > 0;
  } catch (err) {//en caso de un error entra en el catch
    if (client) client.release();
    logger.debug(err);
    return err;//devuelve el error
  }
};
