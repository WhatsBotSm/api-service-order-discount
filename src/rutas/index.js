import express from 'express';
import middlewares from '../middlewares/index.js';
import controllers from '../controladores/index.js';
const router = express.Router();

/*********************** */
router.post('/descuentos', middlewares.validaHeaders, controllers.descuentos.descuentos);
/***************************/ 
router.get('/descuento/:id_descuento', middlewares.validaHeaders,  controllers.descuentos.consultarDes);
/******************** */
router.put('/descuento/:id_descuento', middlewares.validaHeaders,  controllers.descuentos.actDescuentos);
/***************************/ 
router.delete('/descuentos/:id_descuento', middlewares.validaHeaders,  controllers.descuentos.borrarDes);
/******************** */
router.get('/descuentos', middlewares.validaHeaders,  controllers.descuentos.consultarTodoDes);
//middlewares.verificaToken,
export default router;
