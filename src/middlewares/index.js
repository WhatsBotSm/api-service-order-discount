import auth from './authenticacion.js';
import valida from './validateHeaders.js';

export default {
    ...auth, ...valida
}