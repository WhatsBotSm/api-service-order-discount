import respJSON from '../configuraciones/respuesta.js'
import { HTTP_CODIGOS } from '../configuraciones/codigos_http.js';
// import * as servicios from '../servicios/microservicios.js';
import dao from '../dao/pedido/index.js';

export const consultarDes = async (req, res) => {
    let params = {
      query: req.query,
      path: req.params,
      body: req.body,
      header: req.headers
    }
  
    let id_descuento = params.path.id_descuento;
    console.log("id_descuento : ", id_descuento)
    let resBD = await dao.getPedidoById(id_descuento);
  
    let respuesta = {
      ...respJSON,
      codigo: HTTP_CODIGOS._200.contexto._000.codigo,
      mensaje: HTTP_CODIGOS._200.contexto._000.mensaje,
      resultado: resBD
    }
    res.status(HTTP_CODIGOS._200.estatus).send(respuesta)
  }
  export const consultarSus = async (req, res) => {
    let params = {
      query: req.query,
      path: req.params,
      body: req.body,
      header: req.headers
    }
  
    let id_descuento = params.path.id_descuento;
    console.log("id_descuento : ", id_descuento)
    let resBD = await dao.getPedidoById(id_descuento);
  
    let respuesta = {
      ...respJSON,
      codigo: HTTP_CODIGOS._200.contexto._000.codigo,
      mensaje: HTTP_CODIGOS._200.contexto._000.mensaje,
      resultado: resBD
    }
    res.status(HTTP_CODIGOS._200.estatus).send(respuesta)
  }
  export const consultarPag = async (req, res) => {
    let params = {
      query: req.query,
      path: req.params,
      body: req.body,
      header: req.headers
    }
  
    let id_descuento = params.path.id_descuento;
    console.log("id_descuento : ", id_descuento)
    let resBD = await dao.getPedidoById(id_descuento);
  
    let respuesta = {
      ...respJSON,
      codigo: HTTP_CODIGOS._200.contexto._000.codigo,
      mensaje: HTTP_CODIGOS._200.contexto._000.mensaje,
      resultado: resBD
    }
    res.status(HTTP_CODIGOS._200.estatus).send(respuesta)
  }  