import { logger } from '../../funciones/utilerias/logger.js';
import { getClient } from '../../configuraciones/config.db.js';

export const borrar = async function (id_descuento) {
    //console.log("getPedidoById", id_descuento);
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