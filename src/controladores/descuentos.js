import respJSON from "../configuraciones/respuesta.js";
import { HTTP_CODIGOS } from "../configuraciones/codigos_http.js";
// import * as servicios from '../servicios/microservicios.js';
import esquema from "../funciones/validaciones/esquema.js";
import bodys from "../configuraciones/esquemas/generales.js";
import dao from "../dao/descuentos/index.js";

export const consultarDes = async (req, res) => {
  let respuesta = {
    ...respJSON,
    codigo: HTTP_CODIGOS._200.contexto._000.codigo,
    mensaje: HTTP_CODIGOS._200.contexto._000.mensaje
  };
  try {
    let params = {
      query: req.query,
      path: req.params,
      body: req.body,
      header: req.headers
    };

    let id_descuento = params.path.id_descuento;
    console.log("id_descuento : ", id_descuento);
    let resBD = await dao.getByIdDes(id_descuento);
    if (!resBD || resBD.length === 0 || resBD[0] === false) {
      respuesta = {
        ...respJSON,
        codigo: HTTP_CODIGOS._400.contexto._000.codigo,
        mensaje: HTTP_CODIGOS._400.contexto._000.mensaje
      };
      res.status(HTTP_CODIGOS._400.estatus).send(respuesta);
      return;
    }

    respuesta = {
      ...respJSON,
      codigo: HTTP_CODIGOS._200.contexto._000.codigo,
      mensaje: HTTP_CODIGOS._200.contexto._000.mensaje,
      resultado: resBD
    };
    res.status(HTTP_CODIGOS._200.estatus).send(respuesta);
  } catch (error) {
    let respuestaError = {
      ...respJSON,
      codigo: HTTP_CODIGOS._400.contexto._013.codigo,
      mensaje: error.message
    };

    res.status(HTTP_CODIGOS._400.estatus).send(respuestaError);
  }
};

export const descuentos = async (req, res) => {
  let respuesta = {
    ...respJSON,
    codigo: HTTP_CODIGOS._200.contexto._000.codigo,
    mensaje: HTTP_CODIGOS._200.contexto._000.mensaje
  };
  try {
    let params = {
      query: req.query,
      path: req.params,
      body: req.body,
      header: req.headers
    };

    let descount = { ...params.body.descount };
    console.log("descount : ", descount);
    const resBody = await esquema.validarSchema(descount, bodys.descuentosEsquema);
    if (resBody.error) {
      respuesta.codigo = HTTP_CODIGOS._400.contexto._011.codigo;
      respuesta.mensaje = HTTP_CODIGOS._400.contexto._011.mensaje;
      respuesta.errores = resBody.error;
      res.status(HTTP_CODIGOS._400.estatus).send(respuesta);
      return;
    }
    descount = {
      id_client_admin_bot: descount.id_client_admin_bot,
      idbot_control: params.header.identificador_usuario,
      nombre: descount.nombre,
      descripcion: descount.descripcion,
      tipo_descuento: descount.tipo_descuento,
      valor: descount.valor,
      fecha_inicio: descount.fecha_inicio,
      fecha_fin: descount.fecha_fin,
      codigo: descount.codigo
    };
    let values = { ...params.body.values };
    values = {
      nombre: descount.nombre,
      descripcion: descount.descripcion,
      tipo_descuento: descount.tipo_descuento,
      valor: descount.valor,
      codigo: descount.codigo
    };
    const valueArray = Object.values(values);
    const joinedValues = valueArray.join("  |  ");
    let [resBD] = await dao.insertDescuento(descount);
    let bitdescu = { ...params.body.bitdescu };
    console.log("bitdescuentos", bitdescu);
    bitdescu = {
      idbot: params.header.identificador_usuario,
      id_descuento: resBD.id_descuento,
      action_prod: "Nuevo descuento",
      justy_change: "Insercion",
      name_col: "",
      lt_value: "",
      pt_value: joinedValues
    };
    let resBDbit = await dao.insertBitDescu(bitdescu);

    if (!resBD) {
      respuesta = {
        ...respJSON,
        codigo: HTTP_CODIGOS._400.contexto._013.codigo,
        mensaje: HTTP_CODIGOS._400.contexto._013.mensaje,
        resultado: descount
      };
      res.status(HTTP_CODIGOS._400.estatus).send(respuesta);
      return;
    }

    respuesta = {
      ...respJSON,
      codigo: HTTP_CODIGOS._200.contexto._000.codigo,
      mensaje: HTTP_CODIGOS._200.contexto._000.mensaje,
      resultado: { ...resBD, ...descount, ...resBDbit }
    };
    res.status(HTTP_CODIGOS._200.estatus).send(respuesta);
  } catch (error) {
    let respuestaError = {
      ...respJSON,
      codigo: HTTP_CODIGOS._400.contexto._013.codigo,
      mensaje: HTTP_CODIGOS._400.contexto._013.mensaje
    };

    res.status(HTTP_CODIGOS._400.estatus).send(respuestaError);
  }
};
export const actDescuentos = async (req, res) => {
  let respuesta = {
    ...respJSON,
    codigo: HTTP_CODIGOS._200.contexto._000.codigo,
    mensaje: HTTP_CODIGOS._200.contexto._000.mensaje
  };
  try {
    let params = {
      query: req.query,
      path: req.params,
      body: req.body,
      header: req.headers
    };
    let id_descuento = params.path.id_descuento;
    let descount = { ...params.body.descount };
    console.log("descount : ", descount);
    const resBody = await esquema.validarSchema(descount, bodys.descuentosEsquema);

    if (resBody.error) {
      respuesta.codigo = HTTP_CODIGOS._400.contexto._011.codigo;
      respuesta.mensaje = HTTP_CODIGOS._400.contexto._011.mensaje;
      respuesta.errores = resBody.error;
      return res.status(HTTP_CODIGOS._400.estatus).send(respuesta);
    }
    let [descOrig] = await dao.getDescuent(id_descuento);
    console.log("resBody : ", resBody);
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
    let values = {
      nombre: descount.nombre,
      descripcion: descount.descripcion,
      tipo_descuento: descount.tipo_descuento,
      valor: descount.valor,
      codigo: descount.codigo
    };
    const joinedValuesPast = Object.values(descOrig).join(" | ");
    const joinedValuesLast = Object.values(values).join(" | ");
    const diferencias = compararObjetosDetalles(descOrig, values);
    console.log(diferencias);
    let resBD = await dao.updateDes(descount);
    let bitdescu = { ...params.body.bitdescu };
    bitdescu = {
      idbot: descount.idbot_control,
      id_descuento: id_descuento,
      action_prod: "Actualizacion",
      justy_change: "actualizacion",
      name_col: diferencias.join(" | "),
      lt_value: joinedValuesPast,
      pt_value: joinedValuesLast
    };

    let resBDbit = await dao.insertBitDescu(bitdescu);

    respuesta = {
      ...respJSON,
      codigo: HTTP_CODIGOS._200.contexto._000.codigo,
      mensaje: HTTP_CODIGOS._200.contexto._000.mensaje,
      resultado: {...resBD, ...descount, ...resBDbit} 
    };
    res.status(HTTP_CODIGOS._200.estatus).send(respuesta);
  } catch (error) {
    let respuestaError = {
      ...respJSON,
      codigo: HTTP_CODIGOS._400.contexto._013.codigo,
      mensaje: error.message
    };

    res.status(HTTP_CODIGOS._400.estatus).send(respuestaError);
  }
};
export const borrarDes = async (req, res) => {
  let respuesta = {
    ...respJSON,
    codigo: HTTP_CODIGOS._200.contexto._000.codigo,
    mensaje: HTTP_CODIGOS._200.contexto._000.mensaje
  };
  try {
    let params = {
      query: req.query,
      path: req.params,
      body: req.body,
      header: req.headers
    };

    let id_descuento = params.path.id_descuento;
    console.log("id_descuento : ", id_descuento);
    let resBD = await dao.delByIdDes(id_descuento);

    respuesta = {
      ...respJSON,
      codigo: HTTP_CODIGOS._200.contexto._000.codigo,
      mensaje: HTTP_CODIGOS._200.contexto._000.mensaje,
      resultado: resBD
    };
    res.status(HTTP_CODIGOS._200.estatus).send(respuesta);
  } catch (error) {
    let respuestaError = {
      ...respJSON,
      codigo: HTTP_CODIGOS._400.contexto._013.codigo,
      mensaje: error.message
    };

    res.status(HTTP_CODIGOS._400.estatus).send(respuestaError);
  }
};
function compararObjetosDetalles(obj1, obj2) {
  try {
    const diferencias = []; 
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    const allKeys = new Set([...keys1, ...keys2]);

    allKeys.forEach((key) => {
      if (obj1[key] !== obj2[key]) {
        diferencias.push(key);
      }
    });
    return diferencias;

  } catch (error) {
    let respuestaError = {
      ...respJSON,
      codigo: HTTP_CODIGOS._400.contexto._013.codigo,
      mensaje: error.message
    };

    res.status(HTTP_CODIGOS._400.estatus).send(respuestaError);
  }
}

