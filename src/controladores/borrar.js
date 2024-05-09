import respJSON from '../configuraciones/respuesta.js'
import { HTTP_CODIGOS } from '../configuraciones/codigos_http.js';
// import * as servicios from '../servicios/microservicios.js';
import dao from '../dao/pedido/index.js';

export const borrarDes = async (req, res) => {
    let params = {
      query: req.query,
      path: req.params,
      body: req.body,
      header: req.headers
    }
  
    let id_descuento = params.path.id_descuento;
    console.log("id_descuento : ", id_descuento)
    let resBD = await dao.delByIdDes(id_descuento);
  
    let respuesta = {
      ...respJSON,
      codigo: HTTP_CODIGOS._200.contexto._000.codigo,
      mensaje: HTTP_CODIGOS._200.contexto._000.mensaje,
      resultado: resBD
    }
    res.status(HTTP_CODIGOS._200.estatus).send(respuesta)
}
export const borrarSus = async (req, res) => {
    let params = {
      query: req.query,
      path: req.params,
      body: req.body,
      header: req.headers
    }
  
    let id_suscripcion = params.path.id_suscripcion;
    console.log("id_suscripcion : ", id_suscripcion)
    let resBD = await dao.delByIdSus(id_suscripcion);
  
    let respuesta = {
      ...respJSON,
      codigo: HTTP_CODIGOS._200.contexto._000.codigo,
      mensaje: HTTP_CODIGOS._200.contexto._000.mensaje,
      resultado: resBD
    }
    res.status(HTTP_CODIGOS._200.estatus).send(respuesta)
  }
  export const borrarPag = async (req, res) => {
    let params = {
      query: req.query,
      path: req.params,
      body: req.body,
      header: req.headers
    }
  
    let id_pago_suscr = params.path.id_pago_suscr;
    console.log("id_pago_suscr : ", id_pago_suscr)
    let resBD = await dao.delByIdPag(id_pago_suscr);
  
    let respuesta = {
      ...respJSON,
      codigo: HTTP_CODIGOS._200.contexto._000.codigo,
      mensaje: HTTP_CODIGOS._200.contexto._000.mensaje,
      resultado: resBD
    }
    res.status(HTTP_CODIGOS._200.estatus).send(respuesta)
  }  