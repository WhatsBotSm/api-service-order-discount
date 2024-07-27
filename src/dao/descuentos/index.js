import * as insert from './insert.js';
import * as update from './update.js';
import * as select from './select.js';
import * as delete1 from './delete.js';



export default {
  ...insert, ...update, ...select, ...delete1,
};

