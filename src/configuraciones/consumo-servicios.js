export const APESA = {
    URL_AGENTE_E: process.env.API_URL_AGENTE_E || "https://whatsbotsm-order-ag:9013/",
    URL_AGENTE_C: process.env.API_URL_AGENTE_C || "https://whatsbotsm-order-ag:9015/",
    URL_AGENTE_CEP: process.env.API_URL_AGENTE_CEP || "https://whatsbotsm-order-ag:9017/",
    URL_AGENTE_NC: process.env.API_URL_AGENTE_NC || "https://whatsbotsm-order-ag:9019/",
};
const idfrUsuario = "whts-core";
const nameAppl = "api-service-order";

export const Servicios = {
    order: {
        ApiAgenteC: {
            consultaStatusOrden: {
                method: "post",
                url: `${this.APESA.URL_AGENTE_C}/api/consultaStatusOrden`,
                resolveWithFullResponse: true,
                headers: {
                    nombre_aplicativo: nameAppl,
                    identificador_usuario: idfrUsuario
                },
                json: true
            },
            consultaDetalleOrden: {
                method: "post",
                url: `${this.APESA.URL_AGENTE_C}/api/consultaDetalleOrden`,
                resolveWithFullResponse: true,
                headers: {
                    nombre_aplicativo: nameAppl,
                    identificador_usuario: idfrUsuario
                },
                json: true
            },
            consultaDetalleIngreso: {
                method: "post",
                url: `${this.APESA.URL_AGENTE_C}/api/consultaDetalleIngreso`,
                resolveWithFullResponse: true,
                headers: {
                    nombre_aplicativo: nameAppl,
                    identificador_usuario: idfrUsuario
                },
                json: true
            }
        },
        ApiAgenteE: {
            procesaOrden: {
                method: "post",
                url: `${this.APESA.URL_AGENTE_E}/api/procesaOrden`,
                resolveWithFullResponse: true,
                headers: {
                    nombre_aplicativo: nameAppl,
                    identificador_usuario: idfrUsuario
                },
                json: true
            },
        },
        ApiAgenteNC: {
            recibeNotificacion: {
                method: "post",
                url: `${this.APESA.URL_AGENTE_C}/api/recibeNotificacion`,
                resolveWithFullResponse: true,
                headers: {
                    nombre_aplicativo: nameAppl,
                    identificador_usuario: idfrUsuario
                },
                json: true
            },
        },
        ApiAgenteCEP: {
            solicitudCDA: {
                method: "post",
                url: `${this.APESA.URL_AGENTE_CEP}/api/solicitudCDA`,
                resolveWithFullResponse: true,
                headers: {
                    nombre_aplicativo: nameAppl,
                    identificador_usuario: idfrUsuario
                },
                json: true
            },
        }
    }
};
