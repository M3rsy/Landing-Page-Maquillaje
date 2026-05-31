const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const db = require("../database");
const requireAuth = require("../middleware/authMiddleware");
const logger = require("../logger");
const log = logger.child({ module: "products" });

const router = express.Router();

const ALLOWED_EXTENSIONS = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
};

const MAGIC_BYTES = {
  "image/jpeg": [0xff, 0xd8, 0xff],
  "image/png": [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  "image/gif": [0x47, 0x49, 0x46, 0x38],
  "image/webp": [0x52, 0x49, 0x46, 0x46],
};

function normalizeExtension(ext) {
  const lower = ext.toLowerCase();
  if (lower === ".jpeg") return ".jpg";
  return lower;
}

function validateImageFile(filePath, mimeType) {
  const expectedBytes = MAGIC_BYTES[mimeType];
  if (!expectedBytes) {
    throw new Error("La imagen no es válida");
  }
  const buffer = Buffer.alloc(expectedBytes.length);
  const fd = fs.openSync(filePath, "r");
  try {
    fs.readSync(fd, buffer, 0, expectedBytes.length, 0);
  } finally {
    fs.closeSync(fd);
  }
  for (let i = 0; i < expectedBytes.length; i++) {
    if (buffer[i] !== expectedBytes[i]) {
      throw new Error("La imagen no es válida");
    }
  }
  // WebP special check: bytes at offset 8-11 must be "WEBP"
  if (mimeType === "image/webp") {
    const webpCheck = Buffer.alloc(4);
    const fd2 = fs.openSync(filePath, "r");
    try {
      fs.readSync(fd2, webpCheck, 0, 4, 8);
    } finally {
      fs.closeSync(fd2);
    }
    if (webpCheck.toString("ascii") !== "WEBP") {
      throw new Error("La imagen no es válida");
    }
  }
}

function deleteImageFile(imagePath) {
  if (!imagePath) return;
  const fullPath = path.join(__dirname, "..", imagePath);
  try {
    fs.unlinkSync(fullPath);
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
    // File already gone — nothing to do
  }
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dest = process.env.UPLOADS_DIR || path.join(__dirname, "../uploads");
    cb(null, dest);
  },
  filename(req, file, cb) {
    const ext = normalizeExtension(path.extname(file.originalname).toLowerCase());
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const ext = normalizeExtension(path.extname(file.originalname).toLowerCase());
    if (ext === ".svg") {
      return cb(new Error("No se permiten archivos SVG"));
    }
    if (!ALLOWED_EXTENSIONS[ext]) {
      return cb(new Error("Solo se permiten imágenes (jpg, png, gif, webp)"));
    }
    const expectedMime = ALLOWED_EXTENSIONS[ext];
    if (file.mimetype !== expectedMime) {
      return cb(new Error("Solo se permiten imágenes (jpg, png, gif, webp)"));
    }
    cb(null, true);
  },
});

function normalizePayload(body = {}) {
  const precioMayoristaRaw =
    body.precio_mayorista === "" || body.precio_mayorista === null || body.precio_mayorista === undefined
      ? null
      : Number.parseFloat(body.precio_mayorista);

  return {
    codigo: typeof body.codigo === "string" ? body.codigo.trim().toUpperCase() : "",
    titulo: typeof body.titulo === "string" ? body.titulo.trim() : "",
    descripcion: typeof body.descripcion === "string" ? body.descripcion.trim() : "",
    categoria: typeof body.categoria === "string" ? body.categoria.trim() : "",
    marca: typeof body.marca === "string" ? body.marca.trim() : "",
    precio: Number.parseFloat(body.precio),
    costo: Number.parseFloat(body.costo),
    precio_mayorista: precioMayoristaRaw,
    disponible: body.disponible,
  };
}

function validateProductPayload(payload) {
  if (!payload.codigo || !payload.titulo || !payload.categoria) {
    return "Campos requeridos: codigo, titulo, precio, costo, categoria";
  }

  if (!Number.isFinite(payload.precio) || payload.precio < 0) {
    return "El precio debe ser un número mayor o igual a 0";
  }

  if (!Number.isFinite(payload.costo) || payload.costo < 0) {
    return "El costo debe ser un número mayor o igual a 0";
  }

  if (payload.precio_mayorista !== null && (!Number.isFinite(payload.precio_mayorista) || payload.precio_mayorista < 0)) {
    return "El precio mayorista debe ser un número mayor o igual a 0";
  }

  if (payload.codigo.length > 60 || payload.titulo.length > 180 || payload.categoria.length > 80) {
    return "Los campos exceden el largo permitido";
  }

  return null;
}

function escapeLikeWildcards(str) {
  return String(str)
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_");
}

function buildPaginationQuery(page, limit, q) {
  const params = [];
  let where = "";
  if (q && q.trim()) {
    const term = `%${escapeLikeWildcards(q.trim())}%`;
    where = "WHERE titulo LIKE ? ESCAPE '\\' OR codigo LIKE ? ESCAPE '\\'";
    params.push(term, term);
  }

  const countQuery = `SELECT COUNT(*) AS total FROM products ${where}`.trim();
  const dataQuery = `SELECT * FROM products ${where} ORDER BY id DESC LIMIT ? OFFSET ?`.trim();

  return { dataQuery, countQuery, params };
}

// GET /api/products — público
router.get("/", (req, res) => {
  const rows = db.prepare(`
    SELECT id, codigo, titulo, descripcion, precio, precio_mayorista, categoria, marca, imagen, disponible, creado_en
    FROM products
    ORDER BY id DESC
  `).all();
  res.json(rows);
});

// GET /api/products/admin/list — requiere JWT
router.get("/admin/list", requireAuth, (req, res) => {
  let page = parseInt(req.query.page, 10);
  let limit = parseInt(req.query.limit, 10);
  const q = req.query.q;

  if (!Number.isFinite(page) || page < 1) page = 1;
  if (!Number.isFinite(limit) || limit < 1) limit = 20;
  if (limit > 100) limit = 100;

  const offset = (page - 1) * limit;
  const { dataQuery, countQuery, params } = buildPaginationQuery(page, limit, q);

  const countRow = db.prepare(countQuery).get(...params);
  const total = countRow ? countRow.total : 0;

  const dataParams = [...params, limit, offset];
  const rows = db.prepare(dataQuery).all(...dataParams);

  log.info({ event: "product.list", page, limit, q: q || undefined, total });

  res.json({
    data: rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});

// GET /api/products/:id — público
router.get("/:id", (req, res) => {
  const row = db.prepare(`
    SELECT id, codigo, titulo, descripcion, precio, precio_mayorista, categoria, marca, imagen, disponible, creado_en
    FROM products
    WHERE id = ?
  `).get(req.params.id);
  if (!row) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(row);
});

// POST /api/products — requiere JWT
router.post("/", requireAuth, (req, res) => {
  const payload = normalizePayload(req.body);
  const validationError = validateProductPayload(payload);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO products (codigo, titulo, descripcion, precio, costo, precio_mayorista, categoria, marca, disponible)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      payload.codigo,
      payload.titulo,
      payload.descripcion,
      payload.precio,
      payload.costo,
      payload.precio_mayorista,
      payload.categoria,
      payload.marca,
      payload.disponible === false || payload.disponible === "0" ? 0 : 1
    );
    const created = db.prepare("SELECT * FROM products WHERE id = ?").get(info.lastInsertRowid);
    const warnings = [];
    if (Number.isFinite(payload.costo) && Number.isFinite(payload.precio) && payload.costo >= payload.precio) {
      warnings.push({
        field: "costo",
        message: `El costo (${payload.costo}) es mayor o igual al precio de venta (${payload.precio}). Verificá que sea correcto.`,
      });
    }
    if (warnings.length) {
      created.warnings = warnings;
    }
    log.info({ event: "product.created", productId: created.id, codigo: created.codigo }, "Producto creado");
    res.status(201).json(created);
  } catch (err) {
    if (err.message.includes("UNIQUE")) {
      log.warn({ event: "product.duplicate", codigo: payload.codigo }, "Producto duplicado");
      return res.status(409).json({ error: "Ya existe un producto con ese código" });
    }
    throw err;
  }
});

// PUT /api/products/:id — requiere JWT
router.put("/:id", requireAuth, (req, res) => {
  const payload = normalizePayload(req.body);
  const validationError = validateProductPayload(payload);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const existing = db.prepare("SELECT id FROM products WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Producto no encontrado" });

  try {
    db.prepare(`
      UPDATE products
      SET codigo = ?, titulo = ?, descripcion = ?, precio = ?, costo = ?, precio_mayorista = ?, categoria = ?, marca = ?, disponible = ?
      WHERE id = ?
    `).run(
      payload.codigo,
      payload.titulo,
      payload.descripcion,
      payload.precio,
      payload.costo,
      payload.precio_mayorista,
      payload.categoria,
      payload.marca,
      payload.disponible === false || payload.disponible === "0" ? 0 : 1,
      req.params.id
    );
    const updated = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
    const warnings = [];
    if (Number.isFinite(payload.costo) && Number.isFinite(payload.precio) && payload.costo >= payload.precio) {
      warnings.push({
        field: "costo",
        message: `El costo (${payload.costo}) es mayor o igual al precio de venta (${payload.precio}). Verificá que sea correcto.`,
      });
    }
    if (warnings.length) {
      updated.warnings = warnings;
    }
    log.info({ event: "product.updated", productId: updated.id, codigo: updated.codigo }, "Producto actualizado");
    res.json(updated);
  } catch (err) {
    if (err.message.includes("UNIQUE")) {
      log.warn({ event: "product.duplicate", codigo: payload.codigo }, "Producto duplicado");
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
  deleteImageFile(existing.imagen);
  log.info({ event: "product.deleted", productId: existing.id, codigo: existing.codigo }, "Producto eliminado");
  res.json({ ok: true });
});

// POST /api/products/:id/image — requiere JWT
router.post("/:id/image", requireAuth, upload.single("imagen"), (req, res, next) => {
  const existing = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Producto no encontrado" });
  if (!req.file) return res.status(400).json({ error: "No se recibió imagen" });

  try {
    validateImageFile(req.file.path, req.file.mimetype);
  } catch (err) {
    // Remove the invalid file from disk
    try { fs.unlinkSync(req.file.path); } catch (_) { /* ignore */ }
    return res.status(400).json({ error: err.message });
  }

  // Delete previous image if it exists
  if (existing.imagen) {
    deleteImageFile(existing.imagen);
  }

  const imagenUrl = `/uploads/${req.file.filename}`;
  db.prepare("UPDATE products SET imagen = ? WHERE id = ?").run(imagenUrl, req.params.id);
  log.info({ event: "product.image.uploaded", productId: req.params.id, filename: req.file.filename }, "Imagen subida");
  res.json({ imagen: imagenUrl });
});

module.exports = router;
