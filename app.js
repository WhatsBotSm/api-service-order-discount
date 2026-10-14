import "./src/configuraciones/config_api.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import * as uuid from "uuid";
import httpContext from "express-http-context";
import { rateLimit } from "express-rate-limit";
import routes from "./src/rutas/index.js";
import { stream } from "./src/funciones/utilerias/logger.js";
import { firestoreInstance } from "./src/middlewares/firebase.js";

const puerto = process.env.PORT || 8080;
const baseApi = process.env.BASE_API || "/api/service/v1";
const NUM_REQ_MAX_API = Number(process.env.NUM_REQ_MAX_API) || 25;

const apiRequestLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: NUM_REQ_MAX_API, // Límite de peticiones por IP por ventana de tiempo
  message: async (req, res) => `Puede hacer solo ${NUM_REQ_MAX_API} peticiones/min.`,
  skipFailedRequests: true,
  keyGenerator(req, res) {
    return !req.ip ? req.socket.remoteAddress : req.ip.replace(/:\d+[^:]*$/, "");
  },
  standardHeaders: true,
  legacyHeaders: false
});

const app = express();
// app.set('trust proxy', 1);
app.use(apiRequestLimiter);
app.use(firestoreInstance);

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "example.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      }
    },
    frameguard: true,
    xssFilter: true,
    noSniff: true,
    hidePoweredBy: true
  })
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by");
app.use(httpContext.middleware);

app.use(function (req, res, next) {
  // Sin idTrackingReq entrante: 32 hex aleatorios (formato trace-id W3C/OpenTelemetry;
  // uuid v1 incluia la MAC del host y la hora).
  const uuidReq = req.headers.idtrackingreq ? req.headers.idtrackingreq : uuid.v4().replace(/-/g, "");
  res.setHeader("idTrackingReq", uuidReq);
  httpContext.set("idTrackingReq", uuidReq);
  httpContext.set("nombre_aplicativo", req.headers.nombre_aplicativo);
  httpContext.set("identificador_usuario", req.headers.identificador_usuario);
  next();
});

morgan.token("header", (req) => JSON.stringify(req.headers));
morgan.token("body", (req) => JSON.stringify(req.body));
// Sondas del healthcheck de Swarm (deployApp en jenkins-shared-lib: wget a
// /health y a BASE_API cada 15s en cada replica): no se registran. Eran ~98%
// del volumen de logs de la API y no dicen nada que el healthcheck no diga.
const isHealthProbe = (req) =>
  req.path === "/health" ||
  (req.method === "GET" && (req.originalUrl === baseApi || req.originalUrl === `${baseApi}/`) && /^wget/i.test(req.headers["user-agent"] || ""));
app.use(morgan(':status ":method :url"  :req[header] :header :body', { stream, skip: isHealthProbe }));
app.use(firestoreInstance);
app.use(baseApi, routes);
app.get("/health", (req, res) => {
  return res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage()
  });
});
app.use((err, req, res, next) => {
  console.error("Error no manejado:", err.stack);
  return res.status(500).json({
    error: "Internal Server Error",
    requestId: httpContext.get("idTrackingReq")
  });
});

process.on("SIGTERM", () => {
  console.log("Recibido SIGTERM. Cerrando servidor...");
  server.close(() => {
    console.log("Servidor cerrado");
  });
});
console.log(baseApi);
const server = app
  .listen(puerto, () => {
    console.log(`Servicio listo en el puerto: ${puerto}`);
    console.log(`Entorno: ${process.env.NODE_ENV || "development"}`);
  })
  .on("error", (err) => {
    console.error("Error al iniciar servidor:", err);
    throw err;
  });

server.on("connection", (socket) => {
  socket.on("error", (err) => {
    // Solo si la conexion falla (igual que las demas APIs): antes se escribia
    // una linea por CADA conexion TCP, incluidas las del healthcheck.
    console.log(`Nueva conexión desde ${socket.remoteAddress}:${socket.remotePort}`);
    if (err.code === "ECONNRESET") {
      console.error("ECONNRESET detected:", {
        remoteAddress: socket.remoteAddress,
        localPort: socket.localPort,
        bytesWritten: socket.bytesWritten,
        bytesRead: socket.bytesRead,
        timeout: socket.timeout
      });
    }
  });
});

// Ajustes de keep-alive 2026
server.keepAliveTimeout = 60000;
server.headersTimeout = 65000;
export default app;
