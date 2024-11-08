import { logger } from '../funciones/utilerias/logger.js';
// import httpContext from 'express-http-context';
import { Servicios } from '../../src/configuraciones/consumo-servicios.js';
import axios from 'axios';

const enviarAlert = async function (message, phone) {
    const url = { ...Servicios.order.ApiAgenteC.consultaDetalleIngreso.url };
    url.data = {
        message,
        phone
    };
    return ConsumirServicio(url, 'enviar_alerta');
};

const ConsumirServicio = async (url, name) => {
    return axios
        .request(url)
        .then((res) => {
            this.analitycs(name, res.data)
            return res.data;
        })
        .catch((err) => {
            logger.info(name + " | Error Response: ", err?.response?.status);
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

export default { enviarAlert }