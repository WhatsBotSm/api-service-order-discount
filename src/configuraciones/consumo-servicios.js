// URL's
export const ORDER = {
  // deployApp (Jenkinsfile) solo define API_URL_ADMINBOT: sin el respaldo, verificaToken no resuelve el phone del bot
  URL_ADMIN: process.env.API_URL_ADMIN || process.env.API_URL_ADMINBOT
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
  }
};
