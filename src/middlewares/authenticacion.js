import tokenApi from "../funciones/seguridad/token.js";
import { consultaPhoneBot } from "../servicios/serviciosConf.js";
import { obtenerLLaves, descifrarLLaveInt, aclaraText } from "../funciones/utilerias/RSABot.js";
import { logger } from "../funciones/utilerias/logger.js";
const BASE_URL = process.env.BASE_API || "/api/service";

const verificaToken = async (req, res, next) => {
  const mensajeError = "Al menos existe un error.";
  const mensajeNoAuth = "El usuario no tiene los permisos para el recurso.";
  try {
    const method = req.route.stack[0].method;
    const userToken = req.get("idsession");
    if (!userToken) throw new Error("token requerido!");
    const idUser = Number(req.headers.identificador_usuario);
    const { phone } = await consultaPhoneBot(idUser);
    const realTimeDB = req.rtdb;
    const found = await realTimeDB.getCuentaBot(phone);

    const decoded = tokenApi.comprobarToken(userToken, found.seedbot);
    if (decoded) {
      const fullUrl = `${BASE_URL}${req.route.path}`;
      logger.info(fullUrl);
      logger.info("Metodo" + method.toUpperCase());
      req.phoneHost = found.phone;
      next();
    } else {
      res.statusCode = 401;
      res.json({
        codigo: -1,
        mensaje: mensajeError,
        errores: {
          code: 401,
          message: mensajeNoAuth
        }
      });
    }
  } catch (error) {
    res.statusCode = 500;
    res.json({
      codigo: -1,
      mensaje: mensajeError,
      errores: {
        code: 500,
        message: "Error Interno."
      }
    });
  }
};

const verificaLlave = async (req, res, next) => {
  const mensajeError = "Al menos existe un error.";
  try {
    const phoneHost = req.phoneHost;
    const realTimeDB = req.rtdb;
    const llaves = await realTimeDB.getkeysRSA(phoneHost);
    const pass = aclaraText(llaves.pass);
    const seed = aclaraText(llaves.seed);
    const { keysRSA, epoch } = obtenerLLaves(llaves.public, pass);

    // Si 'key' no se usa, la eliminamos
    descifrarLLaveInt(keysRSA.bot, seed, epoch, pass, true);

    next();
  } catch (error) {
    console.error(`Error en verificaLlave: ${error.message}`);
    res.status(500).json({
      codigo: -1,
      mensaje: mensajeError,
      errores: {
        code: 500,
        message: "Error Interno."
      }
    });
  }
};

export default { verificaToken, verificaLlave };
