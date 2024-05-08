import { logger } from '../../../src/funciones/utilerias/logger.js';
import { getClient } from '../../../src/configuraciones/config.db.js';

export const getPedidoByPhone =async function (phone) {
  console.log("getPedidoByPhone", phone);
  let client;
  try {
    client = await getClient();

    const query = `SELECT p.title,p.phone,dp.status,pb.name_prod,pb.price,ctp.title
    FROM orders_bot.pedidos p
    inner join orders_bot.detalle_pedido dp on p.id = dp.id_pedido
    inner join orders_bot.productos_bot pb on dp.id_cat_prod = pb.id_prod 
    inner join orders_bot.cat_tipos_pedido ctp on ctp.id_cat_ped = dp.id_tipo_ped where p.phone= $1`;

    const resultado = await client.query(query, [phone]);
    client.release();

    return resultado.rows.length > 0 ? resultado.rows : [false];
  } catch (err) {
    if (client) client.release();
    logger.debug(err);
    console.log(err)
    return err;
  }
}