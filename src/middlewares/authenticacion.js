import tokenApi from "../funciones/seguridad/token.js";
import { consultaPhoneBot } from "../servicios/serviciosConf.js";
import { obtenerLLaves, descifrarLLaveInt, aclaraText } from "../funciones/utilerias/RSABot.js";
import { logger } from "../funciones/utilerias/logger.js";
import { getSeedBot } from "../dao/configbot.js";
const BASE_URL = process.env.BASE_API || "/api/service";
// Params de ruta que identifican al bot: deben ser el mismo bot del token (identificador_usuario).
const PARAMS_IDBOT = ["idbot", "id_bot", "idbot_control", "idbot_suscr"];
const idbotRutaAjeno = (req) =>
  PARAMS_IDBOT.some((key) => req.params?.[key] !== undefined && String(req.params[key]) !== String(req.headers.identificador_usuario));

// Seed del bot: primero el de BD (adminchat.configbot) y, si el token no valida con ese, el de
// RTDB (CONFIGBOT/<phone>/cuenta, con el que firma auth-service). Antes solo RTDB: si estaba
// desfasada o no respondia, ningun token del bot pasaba.
const verificaSeedBot = async (req, idUser, userToken) => {
  const bot = await getSeedBot(idUser);
  if (bot?.seedbot) {
    const decoded = tokenApi.comprobarToken(userToken, bot.seedbot);
    if (decoded) return { decoded, phone: bot.phone };
  }
  const phone = bot?.phone || (await consultaPhoneBot(idUser))?.phone;
  const found = phone ? await req.rtdb.getCuentaBot(phone) : null;
  const decoded = found?.seedbot ? tokenApi.comprobarToken(userToken, found.seedbot) : false;
  return { decoded, phone: found?.phone || phone };
};

const verificaToken = async (req, res, next) => {
  const mensajeError = "Al menos existe un error.";
  const mensajeNoAuth = "El usuario no tiene los permisos para el recurso.";
  try {
    const method = req.route.stack[0].method;
    const userToken = req.get("idsession");
    if (!userToken) throw new Error("token requerido!");
    // idbot del path de otro bot: 401 antes de resolver el bot (no depende de la consulta del token)
    if (idbotRutaAjeno(req)) {
      res.statusCode = 401;
      return res.json({ codigo: -1, mensaje: mensajeError, errores: { code: 401, message: mensajeNoAuth } });
    }
    const idUser = Number(req.headers.identificador_usuario);
    const { decoded, phone } = await verificaSeedBot(req, idUser, userToken);
    if (decoded) {
      const fullUrl = `${BASE_URL}${req.route.path}`;
      logger.info(fullUrl);
      logger.info("Metodo" + method.toUpperCase());
      req.phoneHost = phone;
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
