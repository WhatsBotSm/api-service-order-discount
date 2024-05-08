import * as insert from './insert.js';
import * as update from './update.js';
import * as consulta from './consulta.js';

export default {
  ...insert, ...update, ...consulta
};

