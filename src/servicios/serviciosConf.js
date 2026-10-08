// import { logger } from "../funciones/utilerias/logger.js";
import { ConsumirServicio } from "./microservicios.js";
import { Servicios } from "../configuraciones/consumo-servicios.js";

export const consultaPhoneBot = async function (id_bot) {
  const url = { ...Servicios.svc_admin.consultaPhoneBot };
  url.url = url.url.replace(":idbot", id_bot);
  const { resultado } = await ConsumirServicio(url, "consultaPhoneBot");
  if (!resultado?.phone) throw new Error("El usuario no tiene los permisos para el recurso.");
  return resultado;
};
