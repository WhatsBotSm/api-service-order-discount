import moment from 'moment-timezone';
const fotmatComplete = 'YYYY-MM-DD HH:mm:ss';
const fotmatShort = 'YYYY-MM-DD';

export const getfechaActual = (complete) => {
    const fecha = moment();
    return complete ? fecha.format(fotmatComplete) : fecha.format(fotmatShort);
}