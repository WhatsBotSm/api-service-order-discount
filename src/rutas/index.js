import express from 'express';
import middlewares from '../middlewares/index.js';
import controllers from '../controladores/index.js';
const router = express.Router();

/*********************** */
router.post('/descuento', middlewares.validaHeaders, middlewares.verificaToken, controllers.descuentos.descuentos);
/***************************/
router.get('/descuento/:id_descuento', middlewares.validaHeaders, middlewares.verificaToken, controllers.descuentos.consultarDes);
/******************** */
router.put('/descuento/:id_descuento', middlewares.validaHeaders, middlewares.verificaToken, controllers.descuentos.actDescuentos);
/***************************/
router.delete('/descuentos/:id_descuento', middlewares.validaHeaders, middlewares.verificaToken, controllers.descuentos.borrarDes);
/******************** */
router.get('/descuento', middlewares.validaHeaders, middlewares.verificaToken, controllers.descuentos.consultarTodoDes);
//middlewares.verificaToken,
export default router;
