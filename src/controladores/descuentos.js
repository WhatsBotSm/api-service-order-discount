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
    let descount = { ...params.body.descount };
    console.log("descount : ", descount)
    const resBody = await esquema.validarSchema(descount, bodys.descuentosEsquema)
    if (resBody.error) {
        respuesta.codigo = HTTP_CODIGOS._400.contexto._011.codigo;
        respuesta.mensaje = HTTP_CODIGOS._400.contexto._011.mensaje;
        respuesta.errores = resBody.error;
        res.status(HTTP_CODIGOS._400.estatus).send(respuesta);
        return
    }   
    descount = {
      id_client_admin_bot: descount.id_client_admin_bot,
      idbot_control: descount.idbot_control,
      nombre: params.header.identificador_usuario,
      descripcion: descount.descripcion,
      tipo_descuento: descount.tipo_descuento,
      valor: descount.valor,
      fecha_inicio: descount.fecha_inicio,
      fecha_fin: descount.fecha_fin,
      codigo: descount.codigo
    };
    let [resBD] = await dao.insertDescuento(descount);

    if(!resBD){
      respuesta = {
        ...respJSON,
        codigo: HTTP_CODIGOS._400.contexto._013.codigo,
        mensaje: HTTP_CODIGOS._400.contexto._013.mensaje,
        resultado: descount,
      }
      res.status(HTTP_CODIGOS._400.estatus).send(respuesta)
      return;
    }
  
    respuesta = {
      ...respJSON,
      codigo: HTTP_CODIGOS._200.contexto._000.codigo,
      mensaje: HTTP_CODIGOS._200.contexto._000.mensaje,
      resultado: {...resBD, ...descount},
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
    let descount = { ...params.body.descount };
    console.log("descount : ", descount)
    const resBody = await esquema.validarSchema(descount, bodys.descuentosEsquema);

if (resBody.error) {
    respuesta.codigo = HTTP_CODIGOS._400.contexto._011.codigo;
    respuesta.mensaje = HTTP_CODIGOS._400.contexto._011.mensaje;
    respuesta.errores = resBody.error;
    return res.status(HTTP_CODIGOS._400.estatus).send(respuesta); 
}   
    console.log("resBody : ", resBody)
    descount = {
      id_descuento: id_descuento,
      id_client_admin_bot: descount.id_client_admin_bot,
      idbot_control: descount.idbot_control,
      nombre: descount.nombre,
      descripcion: descount.descripcion,
      tipo_descuento: descount.tipo_descuento,
      valor: descount.valor,
      fecha_inicio: descount.fecha_inicio,
      fecha_fin: descount.fecha_fin,
      codigo: descount.codigo
    };
    let resBD = await dao.updateDes(descount);
  
    respuesta = {
      ...respJSON,
      codigo: HTTP_CODIGOS._200.contexto._000.codigo,
      mensaje: HTTP_CODIGOS._200.contexto._000.mensaje,
      resultado: descount,
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