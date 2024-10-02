import crypto from 'crypto';
import jwtk from './token.js';

const PBKDF2_ITERATIONS = 100000;
const KEY_LENGTH = 32;
const ALGORITHM = process.env.ALGORITHM || "sha512";
const CIFRADO = process.env.CIFRADO_RSA || "aes-256-gcm";
const ENCODE_RSA = process.env.ENCODE_RSA || "base64";
const ENCODE_PRMS_CRP = process.env.ENCODE_PRMS_CRP || "hex";
const RSA_MODULUS_LENGTH = 4096;

export const generaLLaves = ({ password, seed, expiresIn, otp }) => {
    try {
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
            publicKey: encriptaLlave({ expiresIn, seed, password, otp, key: publicKey }),
            privateKey: encriptaLlave({ expiresIn, seed, password, otp, key: privateKey }),
        };
    } catch (error) {
        console.error("Error al generar llaves:", error);
        throw new Error("No se pudieron generar las llaves.");
    }
};

function encriptaLlave({ key, expiresIn, seed, password, otp }) {
    try {
        const SALT = crypto.randomBytes(16);
        const IV = crypto.randomBytes(16);
        const keyCrpDeriv = crypto.pbkdf2Sync(password, SALT, PBKDF2_ITERATIONS, KEY_LENGTH, ALGORITHM);
        const cipher = crypto.createCipheriv(CIFRADO, keyCrpDeriv, IV);
        cipher.setAAD(Buffer.from(otp || seed));

        let encrypted = cipher.update(key, "utf8", ENCODE_RSA);
        encrypted += cipher.final(ENCODE_RSA);
        const authTag = cipher.getAuthTag();

        const crypParams = `s+${SALT.toString(ENCODE_PRMS_CRP)}|v+${IV.toString(ENCODE_PRMS_CRP)}`;
        const llaveFinal = `${crypParams}:${encrypted}:a+${authTag.toString(ENCODE_PRMS_CRP)}`;
        return jwtk.signToken(expiresIn || "35d", { key: Buffer.from(llaveFinal).toString(ENCODE_RSA), seed }, otp || password);
    } catch (error) {
        console.error("Error al encriptar la llave:", error);
        throw new Error("No se pudo encriptar la llave.");
    }
}

function renuevaLlave({ seed, password, otp, key }) {
    try {
        const SALT = crypto.randomBytes(16);
        const IV = crypto.randomBytes(16);
        const keyCrp = crypto.pbkdf2Sync(password, SALT, PBKDF2_ITERATIONS, KEY_LENGTH, ALGORITHM);
        const cipher = crypto.createCipheriv(CIFRADO, keyCrp, IV);
        cipher.setAAD(Buffer.from(seed));

        let encrypted = cipher.update(key, "utf8", ENCODE_RSA);
        encrypted += cipher.final(ENCODE_RSA);
        const authTag = cipher.getAuthTag();

        const configKeys = `s+${SALT.toString(ENCODE_PRMS_CRP)}|v+${IV.toString(ENCODE_PRMS_CRP)}`;
        const llaveFinal = `${configKeys}:${encrypted}:a+${authTag.toString(ENCODE_PRMS_CRP)}`;
        jwtk.signToken(expiresIn || "35d", { key: Buffer.from(llaveFinal).toString(ENCODE_RSA), seed }, otp || password);
        return;
    } catch (error) {
        console.error("Error al encriptar la llave:", error);
        throw new Error("No se pudo encriptar la llave.");
    }
}

export const desencriptaLlave = async ({ key, seed, password, otp }) => {
    try {
        const { config } = jwtk.comprobarToken(key, otp || password);
        key = config?.key || null;
        if (!key) return;
        const llaveDescomprimida = Buffer.from(key, ENCODE_RSA).toString();
        const [arrConf, encryptedData, authTagData] = llaveDescomprimida.split(":");

        const configKeys = Object.fromEntries(
            [...arrConf.matchAll(/([^|]+)\+([^|]+)/g)].map(([_, k, v]) => [k, Buffer.from(v, ENCODE_PRMS_CRP)])
        );

        const authTag = Buffer.from(authTagData.split("+")[1], ENCODE_PRMS_CRP);
        const keyCrp = crypto.pbkdf2Sync(password, configKeys.s, PBKDF2_ITERATIONS, KEY_LENGTH, ALGORITHM);
        const decipher = crypto.createDecipheriv(CIFRADO, keyCrp, configKeys.v);
        decipher.setAAD(Buffer.from(otp || seed));
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encryptedData, ENCODE_RSA, "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    } catch (error) {
        console.error("Error al desencriptar la llave:", error);
        throw new Error("No se pudo desencriptar la llave.");
    }
};