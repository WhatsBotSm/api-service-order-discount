import Ajv from 'ajv';
import { logger } from '../utilerias/logger.js';
import esquemasGenerales from '../../configuraciones/esquemas/generales.js';
import { HTTP_CODIGOS } from '../../configuraciones/codigos_http.js';

async function validaParametrosGrl(bodyJson, esquema) {
    const detalles = [];
    const ajv = new Ajv({
        allErrors: true
    });
    const valido = ajv.validate(esquemasGenerales[esquema], bodyJson);

    if (!valido) {
        ajv.errors.forEach(function (error) {
            logger.debug('Error en schema: ' + JSON.stringify(error));
            detalles.push(error.dataPath + " " + error.message);
        });
    }
    return valido ? bodyJson : {
        bodyJson,
        error: detalles
    }
}

const validarParametros = async function (bodyJson, dato) {
    const respuesta = {
        body: "",
        header: "",
        query: "",
    };
    if (dato.header.requerido) {
        respuesta.header = await validaParametrosGrl(bodyJson.headers, dato.header.valor);
        if (respuesta.header.error) {
            return {
                codigo: HTTP_CODIGOS._400.contexto._010.codigo,
                mensaje: HTTP_CODIGOS._400.contexto._010.mensaje,
                detalle: respuesta.header
            }
        }
    }
    if (dato.body.requerido) {
        respuesta.body = await validaParametrosGrl(bodyJson.body, dato.body.valor);
        if (respuesta.body.error) {
            return {
                codigo: HTTP_CODIGOS._400.contexto._011.codigo,
                mensaje: HTTP_CODIGOS._400.contexto._011.mensaje,
                detalle: respuesta.body
            }
        }
    }
    if (dato.query.requerido) {
        respuesta.query = await validaParametrosGrl(bodyJson.query, dato.query.valor);
        if (respuesta.query.error) {
            return {
                codigo: HTTP_CODIGOS._400.contexto._011.codigo,
                mensaje: HTTP_CODIGOS._400.contexto._011.mensaje,
                detalle: respuesta.query
            }
        }
    }
    return respuesta;
}

const validar = async function (bodyJson, esquema) {
    const detalles = [];
    const ajv = new Ajv({
        allErrors: true
    });
    const valido = ajv.validate(esquema, bodyJson);
    if (!valido) {
        ajv.errors.forEach(function (error) {
            logger.debug('Error en schema: ' + JSON.stringify(error));
            detalles.push(error.dataPath + " " + error.message);
        });
    }
    return valido ? bodyJson : {
        bodyJson,
        error: detalles
    };
};

export default { validarParametros, validaParametrosGrl, validar }