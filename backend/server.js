const express = require("express");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");

const app = express();
const PORT = process.env.PORT || 3000;

app.disable("x-powered-by");

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
app.use(express.json({ limit: "250kb" }));
app.use(express.urlencoded({ extended: true, limit: "250kb" }));

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; " +
      "script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; " +
      "font-src 'self' data:; connect-src 'self'; media-src 'self' https:"
  );

  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  next();
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas solicitudes. Intenta de nuevo en unos minutos." },
});

app.use("/api", apiLimiter);

// Servir el sitio principal estático
app.use(express.static(path.join(__dirname, "..")));

// Servir imágenes subidas
app.use("/uploads", express.static(process.env.UPLOADS_DIR || path.join(__dirname, "uploads")));

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

  if (err?.type === "entity.too.large") {
    return res.status(413).json({ error: "El payload excede el tamaño permitido" });
  }

  console.error("[server:error]", err);
  return res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`Servidor JRV corriendo en http://localhost:${PORT}`);
  console.log(`Panel admin: http://localhost:${PORT}/admin/`);
  console.log(`API productos: http://localhost:${PORT}/api/products`);
});
