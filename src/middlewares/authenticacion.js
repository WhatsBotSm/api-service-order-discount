import tokenApi from '../funciones/seguridad/token.js';
import * as cnfBot from '../dao/configbot.js';
import { obtenerLLaves, descifrarLLaveInt, ofuscaText, aclaraText, firmarBody } from '../funciones/utilerias/RSABot.js';

const BASE_URL = process.env.BASE_API || '/api/service';
const STORE_BOT = process.env.STORE_BOT || "STORE_BOT";
const UseFirestore = process.env.USEFIRESTORE

const verificaToken = async (req, res, next) => {
    const mensajeError = 'Al menos existe un error.';
    const mensajeNoAuth = '"El usuario no tiene los permisos para el recurso."';
    try {
        const method = req.route.stack[0].method;
        const userToken = req.get('idsession') || '';
        const idUser = req.headers.identificador_usuario;
        console.log('UseFirestore', UseFirestore);
        let found = null;
        if (UseFirestore == "false") {
            let [foundFsdb] = await cnfBot.getConfigBotById(idUser);
            found = foundFsdb
        }
        else {
            const firestore = req.fsdb;
            found = await firestore.getDocById('APPS_WBSM', Number(idUser))
        }
        console.log(found)
        const decoded = tokenApi.comprobarToken(userToken, found.seedbot);
        if (decoded) {
            const fullUrl = `${BASE_URL}${req.route.path}`;
            console.log(fullUrl);
            console.log('Metodo', method.toUpperCase());
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
    const mensajeError = 'Al menos existe un error.';
    const mensajeNoAuth = '"El usuario no tiene los permisos para el recurso."';
    try {
        const rtdb = req.rtdb;

        let collection = `${STORE_BOT}/KEY_BOT`;
        let idBotOff = ofuscaText(`R54K3YS.${req.headers.identificador_usuario}`);

        const llaves = await rtdb.getDocById(collection, idBotOff);

        let pass = aclaraText(llaves.pass);
        let seed = aclaraText(llaves.seed);

        let { keysRSA, epoch } = obtenerLLaves(llaves.public, pass);
        let { key } = descifrarLLaveInt(keysRSA.bot, seed, epoch, pass, true);

        next();
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

export default { verificaToken, verificaLlave }