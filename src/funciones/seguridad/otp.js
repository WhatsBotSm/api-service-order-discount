import { totp } from "otplib";
import moment from "moment-timezone";
const timezone = "America/Mexico_City";
const epoch = Math.floor(moment.tz(timezone).valueOf() / 1000);

totp.options = {
    digits: 6,
    step: 30,
    window: 1,
    epoch: epoch,
    hash: "SHA512",
};

export const generaOTP = (secret) => {
    if (!secret) {
        throw new Error("El secreto es requerido para generar el OTP.");
    }
    try {
        return totp.generate(secret);
    } catch (error) {
        console.error("Error al generar OTP:", error);
        throw new Error("No se pudo generar el OTP.");
    }
};

export const verifyOTP = (secret, otp) => {
    if (!secret || !otp) {
        throw new Error("El secreto y el OTP son requeridos para la verificación.");
    }
    try {
        return totp.check(otp, secret);
    } catch (error) {
        console.error("Error al verificar OTP:", error);
        throw new Error("No se pudo verificar el OTP.");
    }
};
