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
/******************** */
router.put('/descuentos/:id_descuento/:id_client_admin_bot', middlewares.validaHeaders,  controllers.cambiar.descuentos);
//middlewares.verificaToken,
export default router;