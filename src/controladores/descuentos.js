import respJSON from "../configuraciones/respuesta.js";
import { HTTP_CODIGOS } from "../configuraciones/codigos_http.js";
import { logger } from '../../src/funciones/utilerias/logger.js';
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
        codigo: HTTP_CODIGOS._400.contexto._0404.codigo,
        mensaje: HTTP_CODIGOS._400.contexto._0404.mensaje
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
export const consultarDesByIdBot = async (req, res) => {
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

    let idbot_control = params.path.idbot_control;
    console.log("id_descuento : ", idbot_control);
    let resBD = await dao.getDesByIdBot(idbot_control);
    if (!resBD || resBD.length === 0 || resBD[0] === false) {
      respuesta = {
        ...respJSON,
        codigo: HTTP_CODIGOS._400.contexto._0404.codigo,
        mensaje: HTTP_CODIGOS._400.contexto._0404.mensaje
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
export const consultarTodoDes = async (req, res) => {
  let respuesta = {
    ...respJSON,
    codigo: HTTP_CODIGOS._200.contexto._000.codigo,
    mensaje: HTTP_CODIGOS._200.contexto._000.mensaje
  };
  try {
    let resBD = await dao.getTodoDes();
    if (!resBD || resBD.length === 0 || resBD[0] === false) {
      respuesta = {
        ...respJSON,
        codigo: HTTP_CODIGOS._400.contexto._0404.codigo,
        mensaje: HTTP_CODIGOS._400.contexto._0404.mensaje
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
    logger.debug(error)
    let respuestaError = {
      ...respJSON,
      codigo: HTTP_CODIGOS._400.contexto._013.codigo,
      mensaje: error.message
    };

    res.status(HTTP_CODIGOS._400.estatus).send(respuestaError);
  }
};

export const consultarPaginado = async (req, res) => {
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
    let idbot_control = params.path.idbot_control;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const startIndex = (page - 1) * pageSize;
    const { searchTerm, filterType, startDate, endDate } = req.query;

    const descuentos = await dao.getDescuentosPaginados(
      idbot_control,
      startIndex,
      pageSize,
      searchTerm,
      filterType,
      startDate,
      endDate
    );

    if (!descuentos || descuentos.length === 0 || descuentos[0] === false) {
      respuesta = {
        ...respJSON,
        codigo: HTTP_CODIGOS._400.contexto._0404.codigo,
        mensaje: HTTP_CODIGOS._400.contexto._0404.mensaje
      };
      res.status(HTTP_CODIGOS._400.estatus).send(respuesta);
      return;
    }
    const totalDescuentos = await dao.getTotalDescuentos(
      idbot_control,
      searchTerm,
      filterType,
      startDate,
      endDate
    );

    if (!totalDescuentos || totalDescuentos.length === 0 || totalDescuentos[0] === false) {
      respuesta = {
        ...respJSON,
        codigo: HTTP_CODIGOS._400.contexto._0404.codigo,
        mensaje: HTTP_CODIGOS._400.contexto._0404.mensaje
      };
      res.status(HTTP_CODIGOS._400.estatus).send(respuesta);
      return;
    }
    const totalPages = Math.ceil(totalDescuentos / pageSize);

    respuesta = {
      ...respJSON,
      codigo: HTTP_CODIGOS._200.contexto._000.codigo,
      mensaje: HTTP_CODIGOS._200.contexto._000.mensaje,
      resultado: { descuentos, totalPages }
    };
    res.status(HTTP_CODIGOS._200.estatus).send(respuesta);
  } catch (error) {
    logger.debug(error);
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
    if (new Date(descount.fecha_inicio) > new Date(descount.fecha_fin)) {
      respuesta.codigo = HTTP_CODIGOS._400.contexto._014.codigo;
      respuesta.mensaje = HTTP_CODIGOS._400.contexto._014.mensaje;
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
    console.log(error)
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
    if (!descOrig) {
      respuesta = {
        ...respJSON,
        codigo: HTTP_CODIGOS._400.contexto._0404.codigo,
        mensaje: HTTP_CODIGOS._400.contexto._0404.mensaje,
      };
      res.status(HTTP_CODIGOS._400.estatus).send(respuesta);
      return;
    }
    if (new Date(resBody.fecha_inicio) > new Date(resBody.fecha_fin) || new Date(resBody.fecha_inicio) < new Date()) {
      respuesta.codigo = HTTP_CODIGOS._400.contexto._013.codigo;
      respuesta.mensaje = HTTP_CODIGOS._400.contexto._013.mensaje;
      respuesta.errores = resBody.error;
      res.status(HTTP_CODIGOS._400.estatus).send(respuesta);
      return;
    }

    console.log("resBody : ", resBody);
    descount = {
      id_descuento: id_descuento,
      id_client_admin_bot: descount.id_client_admin_bot,
      idbot_control: descount.idbot_control,
      nombre: descount.nombre,
      descripcion: descount.descripcion,
      tipo_descuento: descount.tipo_descuento,
      valor: descount.valor,
      fecha_inicio: descount.fecha_inicio || new Date(),
      fecha_fin: descount.fecha_fin || new Date(),
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
    if (!resBD) {
      respuesta = {
        ...respJSON,
        codigo: HTTP_CODIGOS._400.contexto._013.codigo,
        mensaje: HTTP_CODIGOS._400.contexto._013.mensaje,
      };
      res.status(HTTP_CODIGOS._400.estatus).send(respuesta);
      return;
    }
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
      resultado: { ...resBD, ...descount, ...resBDbit }
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

