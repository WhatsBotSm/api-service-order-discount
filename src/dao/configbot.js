import { logger } from "../../src/funciones/utilerias/logger.js";
import { getClient } from "../../src/configuraciones/config.db.js";
import { aclaraText } from "../../src/funciones/utilerias/RSABot.js";

export const getConfigBotById = async function (Id) {
  let client;
  try {
    client = await getClient();

    const query = `SELECT idbot, namebot, passbot, seedbot, tokenbot, status, address, phone, email, updated
        FROM adminchat.configbot WHERE idbot = $1`;

    const resultado = await client.query(query, [Id]);
    client.release();

    return resultado.rows.length > 0 ? resultado.rows : [false];
  } catch (err) {
    if (client) client.release();
    logger.debug(err);
    logger.error(err);
    return [false];
  }
};

// Seed del bot para verificaToken: phone + seedbot aclarado de adminchat.configbot (fuente de
// verdad). Caché corta: el seed no cambia en la vida de un bot.
const seedCache = new Map();
const SEED_TTL_MS = 60 * 1000;

export const getSeedBot = async function (idbot) {
  const enCache = seedCache.get(idbot);
  if (enCache && enCache.vence > Date.now()) return enCache.bot;
  let client;
  try {
    client = await getClient();
    const { rows } = await client.query("SELECT phone, seedbot FROM adminchat.configbot WHERE idbot = $1 LIMIT 1", [idbot]);
    const bot = rows[0]?.phone ? { phone: `${rows[0].phone}`, seedbot: rows[0].seedbot ? aclaraText(rows[0].seedbot) : null } : null;
    seedCache.set(idbot, { bot, vence: Date.now() + SEED_TTL_MS });
    return bot;
  } catch (err) {
    logger.debug(err);
    console.error(err);
    return null;
  } finally {
    if (client) client.release();
  }
};
