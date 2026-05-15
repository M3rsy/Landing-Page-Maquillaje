const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir el sitio principal estático
app.use(express.static(path.join(__dirname, "..")));

// Servir imágenes subidas
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
