/**
 * Reporte de excepciones a GlitchTip (compatible con el SDK de Sentry). Apagado sin
 * SENTRY_DSN (el SDK no se inicializa). Solo errores (sin trazas ni datos personales):
 * caídas, promesas rechazadas sin manejar y errores que llegan al manejador de Express.
 */
import * as SentrySdk from "@sentry/node";

let sdk = null;

export const iniciarReporteErrores = ({ env = process.env, Sentry = SentrySdk } = {}) => {
  if (!env.SENTRY_DSN || sdk) return Boolean(sdk);
  try {
    Sentry.init({
      dsn: env.SENTRY_DSN,
      environment: env.SENTRY_ENVIRONMENT || env.NODE_ENV || "local",
      // Varias APIs en el mismo proyecto de GlitchTip (back-api): cada error dice de cual es.
      serverName: env.SENTRY_SERVICE || env.npm_package_name || undefined,
      initialScope: { tags: { service: env.SENTRY_SERVICE || env.npm_package_name || "back-api" } },
      sendDefaultPii: false,
      tracesSampleRate: 0,
      skipOpenTelemetrySetup: true
    });
    sdk = Sentry;
    return true;
  } catch (err) {
    console.error("[reporteErrores] GlitchTip apagado:", err?.message || err);
    return false;
  }
};

// Despues de las rutas: errores pasados a next(err) o lanzados en un handler.
export const manejadorErroresExpress = (app) => {
  if (sdk) sdk.setupExpressErrorHandler(app);
};

export const reportarError = (error, extra) => {
  sdk?.captureException(error, extra ? { extra } : undefined);
};
