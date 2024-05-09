import express from 'express';
import middlewares from '../middlewares/index.js';
import controllers from '../controladores/index.js';
const router = express.Router();

router.post('/realizarPedido', middlewares.validaHeaders,  controllers.order.realizarPedido);
/*********************** */
router.post('/pagosuscripcion', middlewares.validaHeaders,  controllers.inse.pagosuscripcion);
router.post('/suscripcion', middlewares.validaHeaders,  controllers.inse.suscripcion);
router.post('/descuentos', middlewares.validaHeaders,  controllers.inse.descuentos);
/***************************/ 
router.get('/consultarDes/:id_descuento', middlewares.validaHeaders,  controllers.consul.consultarDes);
router.get('/consultarSus/:id_suscripcion', middlewares.validaHeaders,  controllers.consul.consultarSus);
router.get('/consultarPag/:id_pago_suscr', middlewares.validaHeaders,  controllers.consul.consultarPag);
/******************** */
router.put('/actDescuentos', middlewares.validaHeaders,  controllers.cambiar.actDescuentos);
router.put('/actSuscripciones', middlewares.validaHeaders,  controllers.cambiar.actSuscripciones);
router.put('/actPagosSus', middlewares.validaHeaders,  controllers.cambiar.actPagosSus);
/***************************/ 
router.delete('/borrarDes/:id_descuento', middlewares.validaHeaders,  controllers.borrar.borrarDes);
router.delete('/borrarSus/:id_suscripcion', middlewares.validaHeaders,  controllers.borrar.borrarSus);
router.delete('/borrarPag/:id_pago_suscr', middlewares.validaHeaders,  controllers.borrar.borrarPag);
/******************** */
//middlewares.verificaToken,
export default router;