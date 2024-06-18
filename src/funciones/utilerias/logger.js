
import winston from 'winston';
import 'winston-daily-rotate-file';
import moment from 'moment-timezone';
import httpContext from 'express-http-context';
import os from "os";

const { splat, combine, timestamp, printf } = winston.format;
const hostname = os.hostname();
const myFormat = printf(({ level, message, meta }) => {
    const idTrackingReq = httpContext.get('idTrackingReq');
    const fecha = moment().tz('America/Mexico_City');
    return `${fecha.format('YYYY-MM-DD HH:mm:ss')}|${level}|${idTrackingReq}|${message}${meta ? JSON.stringify(meta) : ''}`;
});
const transports = {
    console: new winston.transports.Console(
        {
            level: 'info',
            handleExceptions: true,
            colorize: true
        }),
    file: new (winston.transports.DailyRotateFile)(
        {
            filename: './logs/%DATE%/%DATE%' + "_api-service-order_" + hostname + '.log',
            datePattern: 'YYYY-MM-DD',
            level: 'debug',
            zippedArchive: true,
            maxSize: '20m'
        })
};

export const logger = winston.createLogger({
    format: combine(
        timestamp(),
        splat(),
        myFormat
    ),
    transports: [
        transports.console,
        transports.file
    ]
});

export const stream = {
    write: function (message) {
        logger.info(message);
    }
};