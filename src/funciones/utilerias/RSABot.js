import { desencriptaLlave, renuevaLlave } from "../seguridad/rsa.js";
import _token from "../seguridad/token.js";
import { firmarDatos } from "../seguridad/firma.js";
import { generarCadena } from "../seguridad/util.js";
import moment from "moment-timezone";
const timezone = "America/Mexico_City";
const ENCODE_PRMS_CRP = process.env.ENCODE_PRMS_CRP || "hex";
const ENCODE_RSA = process.env.ENCODE_RSA || "base64";

export const ofuscaText = (text) => Buffer.from(Buffer.from(text).toString(ENCODE_PRMS_CRP)).toString(ENCODE_RSA);
export const aclaraText = (text) => Buffer.from(Buffer.from(text, ENCODE_RSA).toString(), ENCODE_PRMS_CRP).toString();

export const renovarLlave = renuevaLlave;

const errorKey = "Error al generar llaves:";

export const renovarAcceso = ({ password, otp, keys, expiresAcss }) => {
  try {
    const epoch = Math.floor(moment.tz(timezone).valueOf() / 1000);
    return {
      tokenStr: `${_token.signToken(
        expiresAcss,
        {
          content: Buffer.from(JSON.stringify({ ...keys })).toString(ENCODE_RSA)
        },
        `${otp || password}.${epoch}`
      )}epoch${epoch}`
    };
  } catch (error) {
    console.error("Error al encriptar la llave:", error);
    throw new Error("No se pudo encriptar la llave.");
  }
};

export const obtenerLLaves = (token, password) => {
  try {
    if (!token || !password) throw new Error("No esposible obtener las llaves.");
    const [jwt, epoch] = token.split("epoch");
    if (!epoch) throw new Error("EL token no es correcto.");

    const { config } = _token.comprobarToken(jwt, `${password}.${epoch}`);
    if (!config?.content) throw new Error("No fue posible validar el contenido del token.");

    return { keysRSA: JSON.parse(Buffer.from(config.content, ENCODE_RSA).toString()), epoch };
  } catch (error) {
    console.error("Error al obtener llaves:", error);
    throw new Error("No se obtener generar las llaves.");
  }
};

export const descifrarLLaveApp = (keyApp, otp, epoch, password, isPublic) => {
  try {
    const keyConfig = { isPublic, key: keyApp, epoch, password, otp };
    return desencriptaLlave(keyConfig);
  } catch (error) {
    console.error(errorKey, error);
    throw new Error(errorKey);
  }
};

export const descifrarLLaveInt = (keyBot, seed, epoch, password, isPublic) => {
  try {
    const keyConfig = { isPublic, key: keyBot, seed, epoch, password };
    return desencriptaLlave(keyConfig);
  } catch (error) {
    console.error(errorKey, error);
    throw new Error(errorKey);
  }
};

export const firmarBody = (body, privateKey, password) => {
  try {
    const cadenaOriginal = generarCadena({ ...body });
    return firmarDatos(cadenaOriginal, privateKey, password);
  } catch (error) {
    console.error(errorKey, error);
    throw new Error(errorKey);
  }
};
