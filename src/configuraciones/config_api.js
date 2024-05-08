import conexion from './env.conexion.js'
import dotenv from 'dotenv';
import groupBy from 'object.groupby';
// import { desencriptar } from '../funciones/utilerias/desencriptar';
// import { logger } from '../funciones/utilerias/logger';
// import fs from 'fs';
dotenv.config();
const environment = process.env.NODE_ENV || "local";
const environmentConfig = conexion.conexion;

environmentConfig.database_config_pg.host = process.env.DB_HOST || environmentConfig.database_config_pg.server;
environmentConfig.database_config_pg.database = process.env.DB_NAME || environmentConfig.database_config_pg.database;
environmentConfig.database_config_pg.user = process.env.DB_USER || environmentConfig.database_config_pg.user;
environmentConfig.database_config_pg.password = process.env.DB_PASSWORD || environmentConfig.database_config_pg.password;
environmentConfig.database_config_pg.port = Number(process.env.DB_PORT) || Number(environmentConfig.database_config_pg.port)
// environmentConfig.database_config_pg.ssl.ca = fs.readFileSync('configuraciones/certificados/root.crt').toString();
// environmentConfig.database_config_pg.ssl.key = fs.readFileSync('configuraciones/certificados/postgresql.key').toString();
// environmentConfig.database_config_pg.ssl.cert = fs.readFileSync('configuraciones/certificados/postgresql.crt').toString();

groupBy.shim();

const finalConfig = environmentConfig;

global.gConfig = finalConfig;

export default finalConfig

console.log('Environment configurado: ' + environment)