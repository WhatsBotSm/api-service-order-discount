import { logger } from '../funciones/utilerias/logger.js';
import esquema from '../funciones/validaciones/esquema.js';
import bodys from '../configuraciones/esquemas/generales.js';
import { HTTP_CODIGOS } from '../configuraciones/codigos_http.js';
import respJSON from '../configuraciones/respuesta.js';

const validaDescuentos = async (req, res, next) => {
    // var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    const parametros = {
        "query": req.query,
        "path": req.params,
        "body": req.body.punto,
        "headers": req.headers
    };
    logger.debug('Parametros:' + JSON.stringify(parametros));
    const respuesta = await esquema.validar(req.body.punto, bodys.descuentosEsquema);
    const respApiJson = { ...respJSON }
    if (respuesta.error) {
        respApiJson.codigo = HTTP_CODIGOS._400.contexto._012.codigo;
        respApiJson.mensaje = HTTP_CODIGOS._400.contexto._012.mensaje;
        respApiJson.errores = respuesta.error;
        res.status(HTTP_CODIGOS._400.estatus).send(respApiJson);
    } else {
        next();
    }
};

export default {
    validaDescuentos
}