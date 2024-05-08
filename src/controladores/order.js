import respJSON from '../configuraciones/respuesta.js'
import { HTTP_CODIGOS } from '../configuraciones/codigos_http.js';
// import * as servicios from '../servicios/microservicios.js';
import dao from '../dao/pedido/index.js';

export const realizarPedido = async (req, res) => {
  let params = {
    query: req.query,
    path: req.params,
    body: req.body,
    header: req.headers
  }

  let pedido = { ...params.body.pedido };
  console.log("pedido : ", pedido)
  pedido = {
    idbot: params.header.identificador_usuario,
    status: pedido.status,
    title: pedido.title,
    email: pedido.email,
    phone: pedido.phone
  };
  //let resBD = await dao.insertPedido(pedido);

  let respuesta = {
    ...respJSON,
    codigo: HTTP_CODIGOS._200.contexto._000.codigo,
    mensaje: HTTP_CODIGOS._200.contexto._000.mensaje,
    resultado: pedido,
    //resBD
  }
  res.status(HTTP_CODIGOS._200.estatus).send(respuesta)
}

export const consultarPedidos = async (req, res) => {
  let params = {
    query: req.query,
    path: req.params,
    body: req.body,
    header: req.headers
  }

  let phone = params.path.phone;
  console.log("phone : ", phone)
  let resBD = await dao.getPedidoByPhone(phone);

  let respuesta = {
    ...respJSON,
    codigo: HTTP_CODIGOS._200.contexto._000.codigo,
    mensaje: HTTP_CODIGOS._200.contexto._000.mensaje,
    resultado: resBD
  }
  res.status(HTTP_CODIGOS._200.estatus).send(respuesta)
}



