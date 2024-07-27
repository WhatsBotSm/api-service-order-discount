import express from 'express';
import swaggerUi from 'swagger-ui-express';
import middlewares from '../middlewares/index.js';
import controllers from '../controladores/index.js';
import swaggerDocument from '../../swagger.js';
const router = express.Router();

// api-doc
router.get('/', (req, res) => res.send('WHATSBOTSM - Servicio de Pedidos - [ productos ]'));
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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
/******************** */
router.get('/descuentos/:idbot_control', middlewares.validaHeaders, middlewares.verificaToken, controllers.descuentos.consultarPaginado);
//middlewares.verificaToken,

router.get('/descuento/idbot/:idbot_control', middlewares.validaHeaders, middlewares.verificaToken, controllers.descuentos.consultarDesByIdBot);
export default router;
