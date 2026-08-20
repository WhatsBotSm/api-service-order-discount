import express from 'express';
import swaggerUi from 'swagger-ui-express';
import middlewares from '../middlewares/index.js';
import controllers from '../controladores/index.js';
import swaggerDocument from '../../swagger.js';
const router = express.Router();
 
// api-doc
router.get('/', (req, res) => res.send('WHATSBOTSM - Servicio de Descuentos'));
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/************ingresar descuento*********** */
router.post('/descuento', middlewares.validaHeaders, middlewares.verificaToken, controllers.descuentos.descuentos);

/***********actualizar descuento********* */
router.put('/descuento/:id_descuento', middlewares.validaHeaders, middlewares.verificaToken, controllers.descuentos.actDescuentos);

/**************consultar descuento por id_bot, con paginado y filtros*************/
router.get('/descuentos/:idbot_control', middlewares.validaHeaders, middlewares.verificaToken, controllers.descuentos.consultarPaginado);

/**************consultar descuento por id_bot********** */
router.get('/descuento/idbot/:idbot_control', middlewares.validaHeaders, middlewares.verificaToken, controllers.descuentos.consultarDesByIdBot);

/**************Nueva ruta********** */
router.get('/ruta1', middlewares.validaHeaders, middlewares.verificaToken, controllers.descuentos.consultarDesByIdBot);

/**************Nueva ruta********** */
router.get('/ruta2', middlewares.validaHeaders, middlewares.verificaToken, controllers.descuentos.consultarDesByIdBot);
   


export default router;
