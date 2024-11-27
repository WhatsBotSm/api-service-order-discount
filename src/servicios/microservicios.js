import { logger } from '../funciones/utilerias/logger.js';
import httpContext from 'express-http-context';
import axios from 'axios';

export const ConsumirServicio = async (url, name) => {
    let token = httpContext.get("idsession")
    let nombre_aplicativo = httpContext.get("nombre_aplicativo")
    let identificador_usuario = httpContext.get("identificador_usuario")
    url.headers.idsession=token;
    url.headers.nombre_aplicativo=nombre_aplicativo;
    url.headers.identificador_usuario=identificador_usuario;
    logger.info('Request: ' + JSON.stringify(url) + ' : ' + token);
    return axios
        .request(url)
        .then((res) => {
            //this.analitycs(name, res.data)
            return res.data;
        })
        .catch((err) => {
            logger.info("Servicio -> " + name)
            logger.info("Error Response: " + err?.response?.status);
            logger.debug({
                "ERROR": true, stack: {
                    function: "ConsumirServicio ",
                    message: "falló al consumir servicio el :" + name,
                    detail: err?.response?.data
                }
            })
            return err?.response?.data;
        });
}