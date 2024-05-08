import * as insert from './insert.js';
import * as insert1 from './insert1.js';
import * as consulta1 from './consulta1.js';
import * as update from './update.js';
import * as update1 from './update1.js';
import * as consulta from './consulta.js';

export default {
  ...insert, ...update, ...consulta, ...consulta1, ...update1, ...insert1
};

