// Load .env before any process.env consumer — must be the first import.
require("./env");

const logger = require("./logger");
const { runHealthChecks, validateEnv } = require("./health-checks");
try {
  validateEnv();
} catch (err) {
  logger.fatal("[startup] Falló la validación de entorno: %s", err.message);
  process.exit(1);
}
try {
  runHealthChecks();
} catch (err) {
  logger.fatal("[startup] Falló la validación de persistencia: %s", err.message);
  process.exit(1);
}

const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const rateLimit = require("express-rate-limit");
const pinoHttp = require("pino-http");
const helmet = require("helmet");
const compression = require("compression");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");

const app = express();
const PORT = process.env.PORT || 3000;

app.disable("x-powered-by");
app.set("trust proxy", 1);

const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      mediaSrc: ["'self'", "https:"],
      ...(process.env.NODE_ENV === "production" && {
        upgradeInsecureRequests: [],
      }),
    },
  },
  frameguard: { action: "deny" },
  hsts: process.env.NODE_ENV === "production" ? { maxAge: 31536000, includeSubDomains: true } : false,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  permissionsPolicy: {
    features: {
      camera: [],
      microphone: [],
      geolocation: [],
    },
  },
};

function httpsRedirect(req, res, next) {
  if (req.secure || req.headers["x-forwarded-proto"] === "https") {
    return next();
  }
  if (req.headers["x-forwarded-proto"] === "http") {
    return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
  }
  return next(); // no proxy header, assume direct HTTP (dev)
}

// Middleware order: helmet (security headers) → httpsRedirect → cors → pinoHttp → body parsers
app.use(helmet(helmetConfig));
app.use(httpsRedirect);
app.use((req, res, next) => {
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

// CORS: restringido a los orígenes definidos en CORS_ORIGIN (separados por coma).
// Si CORS_ORIGIN no está configurado, origin:false bloquea cross-origin correctamente
// porque el frontend y la API corren en el mismo servidor Express.
const rawOrigins = process.env.CORS_ORIGIN;
let corsOptions;
if (rawOrigins) {
  const allowed = rawOrigins.split(",").map((o) => o.trim()).filter(Boolean);
  corsOptions = {
    origin(origin, callback) {
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origen no permitido → ${origin}`));
      }
    },
    credentials: true,
  };
} else {
  corsOptions = { origin: false };
}
app.use(cors(corsOptions));
app.use(compression());
app.use(pinoHttp({ logger }));
app.use(express.json({ limit: "250kb" }));
app.use(express.urlencoded({ extended: true, limit: "250kb" }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas solicitudes. Intenta de nuevo en unos minutos." },
});

app.use("/api", apiLimiter);

// Servir el sitio principal estático
app.use(express.static(path.join(__dirname, ".."), { maxAge: "7d" }));

// Servir imágenes subidas — cache corta porque pueden cambiar
app.use("/uploads", express.static(process.env.UPLOADS_DIR || path.join(__dirname, "uploads"), { maxAge: "1d" }));

// Servir el panel de administración
app.use("/admin", express.static(path.join(__dirname, "../admin")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Catch-all: devolver index.html para cualquier otra ruta
app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

app.use((err, req, res, next) => {
  if (err?.message && err.message.startsWith("CORS:")) {
    return res.status(403).json({ error: err.message });
  }

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ error: "La imagen excede el tamaño máximo permitido (5MB)" });
    }

    return res.status(400).json({ error: "Error al procesar la subida de imagen" });
  }

  if (
    err?.message === "Solo se permiten imágenes" ||
    err?.message === "Solo se permiten imágenes (jpg, png, gif, webp)" ||
    err?.message === "No se permiten archivos SVG" ||
    err?.message === "La imagen no es válida"
  ) {
    return res.status(400).json({ error: err.message });
  }

  if (err?.type === "entity.too.large") {
    return res.status(413).json({ error: "El payload excede el tamaño permitido" });
  }

  const reqLog = req.log || logger;
  reqLog.error({ err, event: "server.error" }, "Error interno del servidor");
  return res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => {
  logger.info({ port: PORT, event: "server.started" }, "Servidor JRV corriendo en http://localhost:%d", PORT);
  logger.info({ port: PORT, event: "admin.available" }, "Panel admin: http://localhost:%d/admin/", PORT);
  logger.info({ port: PORT, event: "api.available" }, "API productos: http://localhost:%d/api/products", PORT);
});
