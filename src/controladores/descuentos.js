import respJSON from '../configuraciones/respuesta.js'
import { HTTP_CODIGOS } from '../configuraciones/codigos_http.js';
// import * as servicios from '../servicios/microservicios.js';
import esquema from '../funciones/validaciones/esquema.js';
import bodys from '../configuraciones/esquemas/generales.js';
import dao from '../dao/descuentos/index.js';

export const consultarDes = async (req, res) => {
    let params = {
      query: req.query,
      path: req.params,
      body: req.body,
      header: req.headers
    }
  
    let id_descuento = params.path.id_descuento;
    console.log("id_descuento : ", id_descuento)
    let resBD = await dao.getByIdDes(id_descuento);
  
    let respuesta = {
      ...respJSON,
      codigo: HTTP_CODIGOS._200.contexto._000.codigo,
      mensaje: HTTP_CODIGOS._200.contexto._000.mensaje,
      resultado: resBD
    }
    res.status(HTTP_CODIGOS._200.estatus).send(respuesta)
}

export const descuentos = async (req, res) => {
    let params = {
      query: req.query,
      path: req.params,
      body: req.body,
      header: req.headers
    }
    let respuesta = {
      ...respJSON,
      codigo: HTTP_CODIGOS._200.contexto._000.codigo,
      mensaje: HTTP_CODIGOS._200.contexto._000.mensaje
    }
    let punto = { ...params.body.punto };
    console.log("punto : ", punto)
    const resBody = await esquema.validarSchema(punto, bodys.descuentosEsquema)
    if (resBody.error) {
        respuesta.codigo = HTTP_CODIGOS._400.contexto._011.codigo;
        respuesta.mensaje = HTTP_CODIGOS._400.contexto._011.mensaje;
        respuesta.errores = resBody.error;
        res.status(HTTP_CODIGOS._400.estatus).send(respuesta);
        return
    }   
    punto = {
      id_descuento: punto.id_descuento,
      id_client_admin_bot: punto.id_client_admin_bot,
      idbot_control: punto.idbot_control,
      nombre: params.header.identificador_usuario,
      descripcion: punto.descripcion,
      tipo_descuento: punto.tipo_descuento,
      valor: punto.valor,
      fecha_inicio: punto.fecha_inicio,
      fecha_fin: punto.fecha_fin,
      codigo: punto.codigo,
      id_producto: punto.id_producto
    };
    let resBD = await dao.insertDescuento(punto);
  
    respuesta = {
      ...respJSON,
      codigo: HTTP_CODIGOS._200.contexto._000.codigo,
      mensaje: HTTP_CODIGOS._200.contexto._000.mensaje,
      resultado: punto,
      resBD
    }
    res.status(HTTP_CODIGOS._200.estatus).send(respuesta)
}
export const actDescuentos = async (req, res) => {
    let params = {
      query: req.query,
      path: req.params,
      body: req.body,
      header: req.headers
    }
    let respuesta = {
      ...respJSON,
      codigo: HTTP_CODIGOS._200.contexto._000.codigo,
      mensaje: HTTP_CODIGOS._200.contexto._000.mensaje
    }
    let id_descuento = params.path.id_descuento;
    let punto = { ...params.body.punto };
    console.log("punto : ", punto)
    const resBody = await esquema.validarSchema(punto, bodys.descuentosEsquema); // Espera a que se resuelva la promesa

if (resBody.error) {
    respuesta.codigo = HTTP_CODIGOS._400.contexto._011.codigo;
    respuesta.mensaje = HTTP_CODIGOS._400.contexto._011.mensaje;
    respuesta.errores = resBody.error;
    return res.status(HTTP_CODIGOS._400.estatus).send(respuesta); // Retorna para salir de la función
}   

// Resto de tu código aquí
 
    console.log("resBody : ", resBody)
    console.log("respuesta",respuesta)
    punto = {
      id_descuento: id_descuento,
      id_client_admin_bot: punto.id_client_admin_bot,
      idbot_control: punto.idbot_control,
      nombre: punto.nombre,
      descripcion: punto.descripcion,
      tipo_descuento: punto.tipo_descuento,
      valor: punto.valor,
      fecha_inicio: punto.fecha_inicio,
      fecha_fin: punto.fecha_fin,
      codigo: punto.codigo,
      id_producto: punto.id_producto
    };
    let resBD = await dao.updateDes(punto);
  
    respuesta = {
      ...respJSON,
      codigo: HTTP_CODIGOS._200.contexto._000.codigo,
      mensaje: HTTP_CODIGOS._200.contexto._000.mensaje,
      resultado: punto,
      resBD
    }
    res.status(HTTP_CODIGOS._200.estatus).send(respuesta)
  }
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