import { generaLLaves, desencriptaLlave, renuevaLlave } from '../seguridad/rsa.js'
import _token from '../seguridad/token.js'
import { firmarDatos, verificarFirma } from '../seguridad/firma.js'
import { generarCadena } from '../seguridad/util.js'
import moment from "moment-timezone";
const timezone = "America/Mexico_City";
const ENCODE_PRMS_CRP = process.env.ENCODE_PRMS_CRP || "hex";
const ENCODE_RSA = process.env.ENCODE_RSA || "base64";

export const ofuscaText = (text) => Buffer.from(Buffer.from(text).toString(ENCODE_PRMS_CRP)).toString(ENCODE_RSA);
export const aclaraText = (text) => Buffer.from(Buffer.from(text, ENCODE_RSA).toString(), ENCODE_PRMS_CRP).toString();


export const generarLLavesInt = ({ passbot, seedbot, expiresKey, epoch }) => {
    try {
        let passOff = ofuscaText(passbot)
        const config = { password: passbot, seed: seedbot || passOff };
        return generaLLaves({ ...config, epoch, expiresIn: expiresKey });
    } catch (error) {
        console.error("Error al generar llaves:", error);
        throw new Error("No se pudieron generar las llaves.");
    }
};

export const generarLLavesApp = (passbot, seedbot, expiresKey, expiresAcss, data) => {
    try {
        const config = { password: passbot, seed: seedbot };
        const epoch = Math.floor(moment.tz(timezone).valueOf() / 1000);
        const app = generaLLaves({ ...config, epoch, expiresIn: expiresKey, otp: otpGenerado, data });
        return {
            tokenStr: `${_token.signToken(expiresAcss, {
                content: Buffer.from(JSON.stringify({ ...app })).toString(ENCODE_RSA)
            }, `${passbot}.${epoch}`)}epoch${epoch}`,
            otp: otpGenerado,
        };
    } catch (error) {
        console.error("Error al generar llaves:", error);
        throw new Error("No se pudieron generar las llaves.");
    }
};

export const renovarLlave = renuevaLlave;

export const renovarAcceso = ({ password, otp, keys, expiresAcss }) => {
    try {
        const epoch = Math.floor(moment.tz(timezone).valueOf() / 1000);
        return {
            tokenStr: `${_token.signToken(expiresAcss, {
                content: Buffer.from(JSON.stringify({ ...keys })).toString(ENCODE_RSA)
            }, `${otp || password}.${epoch}`)}epoch${epoch}`,
        };
    } catch (error) {
        console.error("Error al encriptar la llave:", error);
        throw new Error("No se pudo encriptar la llave.");
    }
}

export const obtenerLLaves = (token, password) => {
    try {
        if (!token || !password) throw new Error("No esposible obtener las llaves.");
        const [jwt, epoch] = token.split("epoch");
        if (!epoch) throw new Error("EL token no es correcto.");

        let { config } = _token.comprobarToken(jwt, `${password}.${epoch}`);
        if (!config?.content) throw new Error("No fue posible validar el contenido del token.");

        return { keysRSA: JSON.parse(Buffer.from(config.content, ENCODE_RSA).toString()), epoch };
    } catch (error) {
        console.error("Error al obtener llaves:", error);
        throw new Error("No se obtener generar las llaves.");
    }
};

export const descifrarLLaveApp = (keyApp, otp, epoch, password, isPublic) => {
    try {
        const keyConfig = { isPublic, key: keyApp, epoch, password, otp }
        return desencriptaLlave(keyConfig);
    } catch (error) {
        console.error("Error al generar llaves:", error);
        throw new Error("No se pudieron generar las llaves.");
    }
};

export const descifrarLLaveInt = (keyBot, seed, epoch, password, isPublic) => {
    try {
        const keyConfig = { isPublic, key: keyBot, seed, epoch, password }
        return desencriptaLlave(keyConfig);
    } catch (error) {
        console.error("Error al generar llaves:", error);
        throw new Error("No se pudieron generar las llaves.");
    }
};

export const firmarBody = (body, privateKey, password) => {
    try {
        const cadenaOriginal = generarCadena({ ...body });
        return firmarDatos(cadenaOriginal, privateKey, password);
    } catch (error) {
        console.error("Error al generar llaves:", error);
        throw new Error("No se pudieron generar las llaves.");
    }
};

export const crearLLavesBot = (passbot, seedbot, expiresKey, expiresAcss) => {
    try {
        if (!seedbot) throw new Error("No es posible crear las llaves para el bot.");
        let epochCreateKey = Math.floor(moment.tz(timezone).valueOf() / 1000);
        let keysEncrBot = generarLLavesInt({ passbot, seedbot, expiresKey, epoch: epochCreateKey });
        let keysEncrBck = generarLLavesInt({ passbot, expiresKey, epoch: epochCreateKey });
        return {
            public: `${_token.signToken(expiresAcss, {
                content: Buffer.from(JSON.stringify({
                    bot: keysEncrBot.publicKey,
                    bck: keysEncrBck.publicKey
                })).toString(ENCODE_RSA)
            }, `${passbot}.${epochCreateKey}`)}epoch${epochCreateKey}`,
            private: `${_token.signToken(expiresAcss, {
                content: Buffer.from(JSON.stringify({
                    bot: keysEncrBot.privateKey,
                    bck: keysEncrBck.privateKey
                })).toString(ENCODE_RSA)
            }, `${passbot}.${epochCreateKey}`)}epoch${epochCreateKey}`
        }
    } catch (error) {
        console.error("Error al crear llaves:", error);
        throw new Error("No se pudieron crear las llaves.");
    }
};