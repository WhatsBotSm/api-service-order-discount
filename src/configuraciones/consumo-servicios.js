// URL's
export const ORDER = {
    URL_ADMIN: process.env.API_URL_ADMIN,
};

const idfrUsuario = "whts-core";
const nameAppl = "api-service-order-discount";

export const Servicios = {
    svc_admin: {
        consultaPhoneBot: {
            method: "get",
            url: `${ORDER.URL_ADMIN}/phone/configbot/:idbot`,
            headers: {
                nombre_aplicativo: nameAppl,
                identificador_usuario: idfrUsuario
            }
        }
    },
};
