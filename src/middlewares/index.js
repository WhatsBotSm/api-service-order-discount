import auth from './authenticacion.js';
import valida from './validateHeaders.js';
import validas from './validateDescuentos.js';

export default {
    ...auth, ...valida, ...validas
}