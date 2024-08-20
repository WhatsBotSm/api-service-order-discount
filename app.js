import './src/configuraciones/config_api.js'
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import * as uuid from 'uuid';
import httpContext from 'express-http-context';
import rateLimit from 'express-rate-limit'
import routes from './src/rutas/index.js';
import { stream } from "./src/funciones/utilerias/logger.js";
import { firestoreInstance } from './src/middlewares/firebase.js'
import swaggerDocument from './swagger.js';
const puerto = process.env.port || 8080;
const baseApi = process.env.BASE_API || '/api/service/v1';
const NUM_REQ_MAX_API = Number(process.env.NUM_REQ_MAX_API) || 25;

const apiRequestLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: NUM_REQ_MAX_API, // limit each IP to 2 requests per windowMs
    message: async (req, res) => `Puede hacer solo ${NUM_REQ_MAX_API} peticiones/min.`,
    skipFailedRequests: true
});

const app = express();

app.use(firestoreInstance)
app.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: false,
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "example.com"],
                objectSrc: ["'none'"],
                upgradeInsecureRequests: [],
            },
        },
    })
);

app.use(apiRequestLimiter);
app.use(helmet());
app.use(helmet.frameguard());
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.hidePoweredBy());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable('x-powered-by');
app.use(httpContext.middleware);

app.use(function (req, res, next) {
    const uuidReq = req.headers.idTrackingReq ? req.headers.idTrackingReq : uuid.v1();
    res.setHeader('idTrackingReq', uuidReq);
    httpContext.set('idTrackingReq', uuidReq);
    httpContext.set('nombre_aplicativo', req.headers.nombre_aplicativo);
    httpContext.set('identificador_usuario', req.headers.identificador_usuario);
    next();
});

morgan.token('header', (req) => JSON.stringify(req.headers));
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':status ":method :url"  :req[header] :header :body', { stream }))
app.use(baseApi, routes);
console.log(baseApi)

app.listen(puerto, () => console.log(`Servicio listo en el puerto : ${puerto}`))

export default app;
