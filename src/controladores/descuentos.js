import respJSON from "../configuraciones/respuesta.js";
import { HTTP_CODIGOS } from "../configuraciones/codigos_http.js";
import { logger } from "../../src/funciones/utilerias/logger.js";
// import * as servicios from '../servicios/microservicios.js';
import esquema from "../funciones/validaciones/esquema.js";
import bodys from "../configuraciones/esquemas/generales.js";
import dao from "../dao/descuentos/index.js";
import moment from 'moment-timezone';

//consultar descuento por id_bot
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

    let idbot_control = params.path.idbot_control;//obtenemos  el id_bot
    let resBD = await dao.getDesByIdBot(idbot_control);//entramos al dao para realizar la consulta de los descuentos por id_bot
    if (!resBD || resBD.length === 0 || resBD[0] === false) {//en caso de que el resultado de la consulta no exista, no arroje ningun resultado o sea false
      respuesta = {//se mandara una respuesta de incorrecto, no hay resultados
        ...respJSON,
        codigo: HTTP_CODIGOS._400.contexto._0404.codigo,
        mensaje: HTTP_CODIGOS._400.contexto._0404.mensaje
      };
      res.status(HTTP_CODIGOS._400.estatus).send(respuesta);
      return;
    }

    respuesta = {//si la consulta se realizo correctamente mandara los datos dentro de resBD
      ...respJSON,
      codigo: HTTP_CODIGOS._200.contexto._000.codigo,
      mensaje: HTTP_CODIGOS._200.contexto._000.mensaje,
      resultado: resBD
    };
    res.status(HTTP_CODIGOS._200.estatus).send(respuesta);
  } catch (error) {//si hay un error en cualquier lugar entrara en el catch
    let respuestaError = {//mandara codigo y mensaje de error al obtener descuento
      ...respJSON,
      codigo: HTTP_CODIGOS._400.contexto._013.codigo,
      mensaje: error.message
    };

    res.status(HTTP_CODIGOS._400.estatus).send(respuestaError);
  }
};

//consultar el descuento paginado con filtros por id_bot
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
    let idbot_control = params.path.idbot_control;//obtenemos  el id_bot
    const page = parseInt(req.query.page) || 1;//se define la pagina en caso de que no se mande se establece en 1 
    const pageSize = parseInt(req.query.pageSize) || 10;//se define cuantos registros se mostraran, en caso de no mandar se establece en 10
    const startIndex = (page - 1) * pageSize;//se define desde donde se iniciara
    const { searchTerm, filterType, startDate, endDate } = req.query;//datos del filtro

    //dao para obtener descuentos por id_bot, agregando paguinado y filtros
    const resBD = await dao.getDescuentosPaginados(idbot_control, startIndex, pageSize, searchTerm, filterType, startDate, endDate);

    if (!resBD || resBD.length === 0 || resBD[0] === false) {//en caso de que el resultado de la consulta no exista, no arroje ningun resultado o sea false
      respuesta = {//se mandara una respuesta de incorrecto, no hay resultados
        ...respJSON,
        codigo: HTTP_CODIGOS._400.contexto._0404.codigo,
        mensaje: HTTP_CODIGOS._400.contexto._0404.mensaje
      };
      res.status(HTTP_CODIGOS._400.estatus).send(respuesta);
      return;
    }

    let descuentos = resBD.rows || [false];//obtenemos los datos de la consulta a descuento
    let totalItems = resBD.Total || 0;//obtenenmos el total de registros
    if (!descuentos || descuentos[0] === false) {//en caso de no existir datos
      respuesta = {//mandara un mensaje de error peticion incorrecta
        ...respJSON,
        codigo: HTTP_CODIGOS._400.contexto._000.codigo,
        mensaje: HTTP_CODIGOS._400.contexto._000.mensaje
      };
      res.status(HTTP_CODIGOS._400.estatus).send(respuesta);
      return;
    }
    const totalPages = Math.ceil(totalItems / pageSize);//obtenemos el total de las paguinas

    respuesta = {//mandamos el resultado de la consulta el total de paguinas y la paguina actual al resultado
      ...respJSON,
      codigo: HTTP_CODIGOS._200.contexto._000.codigo,
      mensaje: HTTP_CODIGOS._200.contexto._000.mensaje,
      resultado: { descuentos, totalPages, page, totalItems }
    };
    res.status(HTTP_CODIGOS._200.estatus).send(respuesta);
  } catch (error) {//en caso de haber un error en algun lugar entramos en el catch
    logger.debug(error);
    let respuestaError = {//mandara como respuesta un error al procesar descuento
      ...respJSON,
      codigo: HTTP_CODIGOS._400.contexto._013.codigo,
      mensaje: error.message
    };
    res.status(HTTP_CODIGOS._400.estatus).send(respuestaError);
  }
};

//ingresar descuento
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

    let descount = { ...params.body.descount };//datos del body
    const resBody = await esquema.validarSchema(descount, bodys.descuentosEsquema);//valida el esquema para que los datos sean del tipo indicado
    if (resBody.error) {//en caso de que el esquema diga que un dato no es del tipo indicado
      //mandara mensaje y codigo de esquema invalido y el error de esquema que presenta junto con una respuesta con el error y un codigo 400
      respuesta.codigo = HTTP_CODIGOS._400.contexto._011.codigo;
      respuesta.mensaje = HTTP_CODIGOS._400.contexto._011.mensaje;
      respuesta.errores = resBody.error;
      res.status(HTTP_CODIGOS._400.estatus).send(respuesta);
      return;
    }//en caso de que el esquema sea correcto continuamos
    if (new Date(descount.fecha_inicio) > new Date(descount.fecha_fin)) {//si la fecha inicio es mayor a la fecha fin
      //se mandara un mensaje indicando que la fecha fin no debe ser menor a la inicial junto con una respuesta de un codigo 400
      respuesta.codigo = HTTP_CODIGOS._400.contexto._014.codigo;
      respuesta.mensaje = HTTP_CODIGOS._400.contexto._014.mensaje;
      respuesta.errores = resBody.error;
      res.status(HTTP_CODIGOS._400.estatus).send(respuesta);
      return;
    }
    descount = {//se establecen los datos que recibira para que se ingresen
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
    values = {//se establecen datos que podrian cambiar para la bitacora de descuento
      nombre: descount.nombre,
      descripcion: descount.descripcion,
      tipo_descuento: descount.tipo_descuento,
      valor: descount.valor,
      codigo: descount.codigo
    };
    const valueArray = Object.values(values);//se juntan los detos de values
    const joinedValues = valueArray.join("  |  "); //se separan por medio de un | cada dato
    const firestore = req.fsdb;
    let [resBD] = await dao.insertDescuento(descount);//se ingresa al dao para hacer el insert de los datos en descount

    if (!resBD) {//en caso de no poder insertarse 
      respuesta = {//manda un mensaje de error al procesar junto con un codigo 400
        ...respJSON,
        codigo: HTTP_CODIGOS._400.contexto._013.codigo,
        mensaje: HTTP_CODIGOS._400.contexto._013.mensaje,
        resultado: descount
      };
      res.status(HTTP_CODIGOS._400.estatus).send(respuesta);
      return;
    }//en caso de que se logre insertar continua

    let found = await firestore.addDoc(`cat_descuentos_${descount.idbot_control}`, Number(resBD.id_descuento), { ...resBD, ...descount, created: moment(), updated: moment() })

    let bitdescu = { ...params.body.bitdescu };

    bitdescu = {//datos que se ingresaran en la bitacora
      idbot: params.header.identificador_usuario,
      id_descuento: resBD.id_descuento,
      action_prod: "Nuevo descuento",
      justy_change: "Insercion",
      name_col: "",
      lt_value: "",
      pt_value: joinedValues
    };
    let resBDbit = await dao.insertBitDescu(bitdescu);//se insertan los datos de bitdescu en la tabla de bitacora por el dao

    //en caso de que los datos se ingresaron correctamente mandara como respuesta los datos que se ingresaron su id y los datos de la bitacora
    respuesta = {
      ...respJSON,
      codigo: HTTP_CODIGOS._200.contexto._000.codigo,
      mensaje: HTTP_CODIGOS._200.contexto._000.mensaje,
      resultado: { ...resBD, ...descount, ...resBDbit }
    };
    res.status(HTTP_CODIGOS._200.estatus).send(respuesta);
  } catch (error) {//en caso de haber un error en algun lugar
    let respuestaError = {//manda un mensaje de error al procesar descuento con codigo 400
      ...respJSON,
      codigo: HTTP_CODIGOS._400.contexto._013.codigo,
      mensaje: HTTP_CODIGOS._400.contexto._013.mensaje
    };
    //manda el error general como respuesta
    res.status(HTTP_CODIGOS._400.estatus).send(respuestaError);
  }
};

//actualizar descuento
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
    let id_descuento = params.path.id_descuento;//id descuento a actualizar
    let descount = { ...params.body.descount };//body que se quiere actualizar
    //validar el esquema 
    const resBody = await esquema.validarSchema(descount, bodys.descuentosEsquema);

    if (resBody.error) {//en caso de que el esquema diga que un dato no es del tipo indicado
      //mandara mensaje y codigo de esquema invalido y el error de esquema que presenta junto con una respuesta con el error y un codigo 400
      respuesta.codigo = HTTP_CODIGOS._400.contexto._011.codigo;
      respuesta.mensaje = HTTP_CODIGOS._400.contexto._011.mensaje;
      respuesta.errores = resBody.error;
      return res.status(HTTP_CODIGOS._400.estatus).send(respuesta);
    }
    let [descOrig] = await dao.getDescuent(id_descuento);//entra al dao para hacer una consulta al descuento seleccionado para ver sus valores originales
    if (!descOrig) {//si la consulta salio incorrecta
      respuesta = {//mensaje indicando que no hay resultados
        ...respJSON,
        codigo: HTTP_CODIGOS._400.contexto._0404.codigo,
        mensaje: HTTP_CODIGOS._400.contexto._0404.mensaje
      };
      res.status(HTTP_CODIGOS._400.estatus).send(respuesta);
      return;
    }
    if (new Date(resBody.fecha_inicio) > new Date(resBody.fecha_fin)) {//si la fecha inicio es mayor a la fecha fin
      //se mandara un mensaje indicando que la fecha fin no debe ser menor a la inicial junto con una respuesta de un codigo 400
      respuesta.codigo = HTTP_CODIGOS._400.contexto._013.codigo;
      respuesta.mensaje = HTTP_CODIGOS._400.contexto._013.mensaje;
      respuesta.errores = resBody.error;
      res.status(HTTP_CODIGOS._400.estatus).send(respuesta);
      return;
    }

    descount = {//datos que actualizara
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

    let valuesBit = {//se establecen datos que podrian cambiar para la bitacora de descuento
      nombre: descount.nombre,
      descripcion: descount.descripcion,
      tipo_descuento: descount.tipo_descuento,
      valor: descount.valor,
      codigo: descount.codigo
    };
    const joinedValuesPast = Object.values(descOrig).join(" | ");//datos originales separados por un pipe
    const joinedValuesLast = Object.values(valuesBit).join(" | ");//datos que se cambiaran separados por un pipe
    const diferencias = compararObjetosDetalles(descOrig, valuesBit);//funcion que compara ambas cadenas y envia cuales son diferentes
    const firestore = req.fsdb;

    let resBD = await dao.updateDes(descount);//funcion que entra al dao para actualizar un descuento

    if (!resBD) {//en caso de que no se pueda actualizar
      respuesta = {//manda un error al procesar el descuento
        ...respJSON,
        codigo: HTTP_CODIGOS._400.contexto._013.codigo,
        mensaje: HTTP_CODIGOS._400.contexto._013.mensaje
      };
      res.status(HTTP_CODIGOS._400.estatus).send(respuesta);
      return;
    }

    firestore.updateDoc(`cat_descuentos_${descount.idbot_control}`, Number(descount.id_descuento), { ...descount, updated: moment() })

    let bitdescu = { ...params.body.bitdescu };
    bitdescu = {//datos que se ingresaran a la bitacora
      idbot: descount.idbot_control,
      id_descuento: id_descuento,
      action_prod: "Actualizacion",
      justy_change: "actualizacion",
      name_col: diferencias.join(" | "),
      lt_value: joinedValuesPast,
      pt_value: joinedValuesLast
    };

    let resBDbit = await dao.insertBitDescu(bitdescu);//funcion que entra al dao para ingresar datos a la bitacora descuento

    respuesta = {//en caso de que todo sea correcto manda un codigo 200 junto a los datos actualizados, id_descuento y datos de la bitacora
      ...respJSON,
      codigo: HTTP_CODIGOS._200.contexto._000.codigo,
      mensaje: HTTP_CODIGOS._200.contexto._000.mensaje,
      resultado: { ...resBD, ...descount, ...resBDbit }
    };
    res.status(HTTP_CODIGOS._200.estatus).send(respuesta);
  } catch (error) {//en caso de haber un error en algun lugar
    let respuestaError = {//manda un mensaje de error al procesar descuento con codigo 400
      ...respJSON,
      codigo: HTTP_CODIGOS._400.contexto._013.codigo,
      mensaje: error.message
    };
    //manda el error general como respuesta
    res.status(HTTP_CODIGOS._400.estatus).send(respuestaError);
  }
};

//funcion que compara los objetos para la bitacora
function compararObjetosDetalles(obj1, obj2) {
  try {
    // Inicializa un array vacío para almacenar las claves donde los valores son diferentes
    const diferencias = [];
    // Obtiene las claves (keys) de ambos objetos para su comparación
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    // Crea un conjunto con todas las claves de ambos objetos para asegurar que se verifiquen todas las claves posibles
    const allKeys = new Set([...keys1, ...keys2]);

    // Recorre cada clave en el conjunto de todas las claves
    allKeys.forEach((key) => {
      // Compara los valores correspondientes a la clave en ambos objetos, si los valores son diferentes, añade la clave al array de diferencias
      if (obj1[key] !== obj2[key]) {
        diferencias.push(key);
      }
    });
    // Devuelve el array con las claves que tienen diferencias entre los dos objetos.
    return diferencias;
  } catch (error) {
    // Manejo de errores: si ocurre una excepción durante el proceso, se captura aquí
    let respuestaError = {
      ...respJSON,
      codigo: HTTP_CODIGOS._400.contexto._013.codigo, // Código de error específico.
      mensaje: error.message // Mensaje de error.
    };
    // Envía la respuesta de error con el estatus 400
    res.status(HTTP_CODIGOS._400.estatus).send(respuestaError);
  }
}
