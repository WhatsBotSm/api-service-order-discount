import crypto from 'crypto';
import jwtk from './token.js';

const PBKDF2_ITERATIONS = 100000;
const KEY_LENGTH = 32;
const ALGORITHM = process.env.ALGORITHM || "sha512";
const CIFRADO = process.env.CIFRADO_RSA || "aes-256-gcm";
const ENCODE_RSA = process.env.ENCODE_RSA || "base64";
const ENCODE_PRMS_CRP = process.env.ENCODE_PRMS_CRP || "hex";
const RSA_MODULUS_LENGTH = 4096;

export const generaLLaves = ({ password, seed, epoch, expiresIn, otp, data }) => {
    try {
        if (!password) throw new Error("No se es posible generar las llaves.");
        const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
            modulusLength: RSA_MODULUS_LENGTH,
            publicKeyEncoding: {
                type: "spki",
                format: "pem",
            },
            privateKeyEncoding: {
                type: "pkcs8",
                format: "pem",
                cipher: "aes-256-cbc",
                passphrase: password,
            },
            publicExponent: 0x10001,
        });

        return {
            publicKey: encriptaLlave({ isPublic: true, key: publicKey, expiresIn, seed, epoch, password, otp, data }),
            privateKey: encriptaLlave({ key: privateKey, expiresIn, seed, epoch, password, otp, data }),
        };
    } catch (error) {
        console.error("Error al generar llaves:", error);
        throw new Error("No se pudieron generar las llaves.");
    }
};

function encriptaLlave({ isPublic, key, expiresIn, seed, epoch, password, otp, data }) {
    try {
        if (!seed && !otp) throw new Error("No es posible encriptar las llaves.");
        const SALT = crypto.randomBytes(16);
        const IV = crypto.randomBytes(16);
        const keyCrpDeriv = crypto.pbkdf2Sync(password, SALT, PBKDF2_ITERATIONS, KEY_LENGTH, ALGORITHM);
        const cipher = crypto.createCipheriv(CIFRADO, keyCrpDeriv, IV);
        const secretAdd = otp ? `${otp}.${epoch}` : `${seed}.${epoch}`
        cipher.setAAD(Buffer.from(secretAdd));

        let encrypted = cipher.update(key, "utf8", ENCODE_RSA);
        encrypted += cipher.final(ENCODE_RSA);
        const authTag = cipher.getAuthTag();

        const crypParams = `s+${SALT.toString(ENCODE_PRMS_CRP)}|v+${IV.toString(ENCODE_PRMS_CRP)}`;
        const llaveFinal = `${crypParams}:${encrypted}:a+${authTag.toString(ENCODE_PRMS_CRP)}`;
        let signToken = isPublic ? password : otp || seed;
        return jwtk.signToken(expiresIn || "5d", { data, key: Buffer.from(llaveFinal).toString(ENCODE_RSA) }, `${signToken}.${epoch}`);
    } catch (error) {
        console.error("Error al encriptar la llave:", error);
        throw new Error("No se pudo encriptar la llave.");
    }
}

export const renuevaLlave = ({ password, otp, encrypted, expiresKey }) => {
    try {
        if (!password && !otp) throw new Error("No es posible encriptar las llaves.");
        return jwtk.signToken(expiresKey || "5d", { key: Buffer.from(encrypted).toString(ENCODE_RSA) }, otp || password);
    } catch (error) {
        console.error("Error al encriptar la llave:", error);
        throw new Error("No se pudo encriptar la llave.");
    }
}

export const desencriptaLlave = ({ isPublic, key, seed, epoch, password, otp }) => {
    try {
        let signToken = isPublic ? password : otp || seed;
        const { config } = jwtk.comprobarToken(key, `${signToken}.${epoch}`);
        key = config?.key || null;
        if (!key) return;
        const secretAdd = otp ? `${otp}.${epoch}` : `${seed}.${epoch}`;
        const llaveDescomprimida = Buffer.from(key, ENCODE_RSA).toString();
        const [arrConf, encryptedData, authTagData] = llaveDescomprimida.split(":");

        const configKeys = Object.fromEntries(
            [...arrConf.matchAll(/([^|]+)\+([^|]+)/g)].map(([_, k, v]) => [k, Buffer.from(v, ENCODE_PRMS_CRP)])
        );

        const authTag = Buffer.from(authTagData.split("+")[1], ENCODE_PRMS_CRP);
        const keyCrp = crypto.pbkdf2Sync(password, configKeys.s, PBKDF2_ITERATIONS, KEY_LENGTH, ALGORITHM);
        const decipher = crypto.createDecipheriv(CIFRADO, keyCrp, configKeys.v);
        decipher.setAAD(Buffer.from(secretAdd));
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encryptedData, ENCODE_RSA, "utf8");
        decrypted += decipher.final("utf8");
        return { key: decrypted, data: config?.data };
    } catch (error) {
        console.error("Error al desencriptar la llave:", error);
        throw new Error("No se pudo desencriptar la llave.");
    }
};