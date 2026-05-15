const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../database");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dest = path.join(__dirname, "../uploads");
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Solo se permiten imágenes"));
    }
    cb(null, true);
  },
});

// GET /api/products — público
router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM products ORDER BY id DESC").all();
  res.json(rows);
});

// GET /api/products/:id — público
router.get("/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(row);
});

// POST /api/products — requiere JWT
router.post("/", requireAuth, (req, res) => {
  const { codigo, titulo, descripcion, precio, costo, categoria, disponible } = req.body;
  if (!codigo || !titulo || precio == null || costo == null || !categoria) {
    return res.status(400).json({ error: "Campos requeridos: codigo, titulo, precio, costo, categoria" });
  }
  try {
    const stmt = db.prepare(`
      INSERT INTO products (codigo, titulo, descripcion, precio, costo, categoria, disponible)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      codigo,
      titulo,
      descripcion || "",
      parseFloat(precio),
      parseFloat(costo),
      categoria,
      disponible === false || disponible === "0" ? 0 : 1
    );
    const created = db.prepare("SELECT * FROM products WHERE id = ?").get(info.lastInsertRowid);
    res.status(201).json(created);
  } catch (err) {
    if (err.message.includes("UNIQUE")) {
      return res.status(409).json({ error: "Ya existe un producto con ese código" });
    }
    throw err;
  }
});

// PUT /api/products/:id — requiere JWT
router.put("/:id", requireAuth, (req, res) => {
  const { codigo, titulo, descripcion, precio, costo, categoria, disponible } = req.body;
  const existing = db.prepare("SELECT id FROM products WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Producto no encontrado" });

  try {
    db.prepare(`
      UPDATE products
      SET codigo = ?, titulo = ?, descripcion = ?, precio = ?, costo = ?, categoria = ?, disponible = ?
      WHERE id = ?
    `).run(
      codigo,
      titulo,
      descripcion || "",
      parseFloat(precio),
      parseFloat(costo),
      categoria,
      disponible === false || disponible === "0" ? 0 : 1,
      req.params.id
    );
    const updated = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
    res.json(updated);
  } catch (err) {
    if (err.message.includes("UNIQUE")) {
      return res.status(409).json({ error: "Ya existe un producto con ese código" });
    }
    throw err;
  }
});

// DELETE /api/products/:id — requiere JWT
router.delete("/:id", requireAuth, (req, res) => {
  const existing = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Producto no encontrado" });
  db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

// POST /api/products/:id/image — requiere JWT
router.post("/:id/image", requireAuth, upload.single("imagen"), (req, res) => {
  const existing = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Producto no encontrado" });
  if (!req.file) return res.status(400).json({ error: "No se recibió imagen" });

  const imagenUrl = `/uploads/${req.file.filename}`;
  db.prepare("UPDATE products SET imagen = ? WHERE id = ?").run(imagenUrl, req.params.id);
  res.json({ imagen: imagenUrl });
});

module.exports = router;
