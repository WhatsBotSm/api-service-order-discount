import express from 'express';
import middlewares from '../middlewares/index.js';
import controllers from '../controladores/index.js';
const router = express.Router();

/*********************** */
router.post('/descuentos', middlewares.validaHeaders, middlewares.validaDescuentos, controllers.descuentos.descuentos);
/***************************/ 
router.get('/descuentos/:id_descuento', middlewares.validaHeaders,  controllers.descuentos.consultarDes);
/******************** */
router.put('/descuentos/:id_descuento', middlewares.validaHeaders, middlewares.validaDescuentos,  controllers.descuentos.actDescuentos);
/***************************/ 
router.delete('/descuentos/:id_descuento', middlewares.validaHeaders,  controllers.descuentos.borrarDes);
/******************** */
//middlewares.verificaToken,
export default router;
