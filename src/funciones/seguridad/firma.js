import crypto from 'crypto';
const ALGORITHM = process.env.ALGORITHM || "sha512";
const ENCODE_RSA = process.env.ENCODE_RSA || "base64";

export function firmarDatos(message, privateKey, password) {
    try {
        const signer = crypto.createSign(ALGORITHM);
        signer.update(message);
        signer.end();

        const firma = signer.sign({
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            passphrase: password,
            saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
        }).toString(ENCODE_RSA);

        return firma;
    } catch (error) {
        console.error("Error al firmar los datos:", error);
        throw "Error al firmar los datos";
    }
}

export function verificarFirma(message, signature, publicKey) {
    try {
        const verifier = crypto.createVerify(ALGORITHM);
        verifier.update(message);
        verifier.end();

        const esValido = verifier.verify({
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
        }, signature, ENCODE_RSA);

        return esValido;
    } catch (error) {
        console.error("Error al verificar la firma:", error);
        throw "Error al verificar la firma";
    }
}