import respJSON from '../configuraciones/respuesta.js'
import { HTTP_CODIGOS } from '../configuraciones/codigos_http.js';
// import * as servicios from '../servicios/microservicios.js';
import dao from '../dao/pedido/index.js';

export const descuentos = async (req, res) => {
    let params = {
      query: req.query,
      path: req.params,
      body: req.body,
      header: req.headers
    }
    let id_descuento = params.path.id_descuento;
    console.log("id_descuento : ", id_descuento)
    let resBD = await dao.updateDes(id_descuento);
  
    let punto = { ...params.body.punto };
    console.log("punto : ", punto)
    punto = {
      //id_descuento: punto.id_descuento,
      id_client_admin_bot: id_descuento.id_client_admin_bot,
      idbot_control: id_descuento.idbot_control,
      created: id_descuento.created,
      updated: id_descuento.updated,
      nombre: params.header.identificador_usuario,
      descripcion: id_descuento.descripcion,
      tipo_descuento: id_descuento.tipo_descuento,
      valor: id_descuento.valor,
      fecha_inicio: id_descuento.fecha_inicio,
      fecha_fin: id_descuento.fecha_fin,
      codigo: id_descuento.codigo,
      id_producto: id_descuento.id_producto
    };
    resBD = await dao.updateDes(id_descuento);
  
    let respuesta = {
      ...respJSON,
      codigo: HTTP_CODIGOS._200.contexto._000.codigo,
      mensaje: HTTP_CODIGOS._200.contexto._000.mensaje,
      resultado: punto,
      resBD
    }
    res.status(HTTP_CODIGOS._200.estatus).send(respuesta)
  }