const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");

const app = express();
const PORT = process.env.PORT || 3000;

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir el sitio principal estático
app.use(express.static(path.join(__dirname, "..")));

// Servir imágenes subidas (path configurable para deploys con volumen persistente)
app.use("/uploads", express.static(process.env.UPLOADS_DIR || path.join(__dirname, "uploads")));

// Servir el panel de administración
app.use("/admin", express.static(path.join(__dirname, "../admin")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Catch-all: devolver index.html para cualquier otra ruta
app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor JRV corriendo en http://localhost:${PORT}`);
  console.log(`Panel admin: http://localhost:${PORT}/admin/`);
  console.log(`API productos: http://localhost:${PORT}/api/products`);
});
