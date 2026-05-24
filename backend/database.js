const { DatabaseSync } = require("node:sqlite");
const path = require("path");

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "jrv.db");
const db = new DatabaseSync(DB_PATH);

db.exec("PRAGMA journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo      TEXT    UNIQUE NOT NULL,
    titulo      TEXT    NOT NULL,
    descripcion TEXT,
    precio      REAL    NOT NULL,
    costo       REAL    NOT NULL,
    categoria   TEXT    NOT NULL,
    marca       TEXT    DEFAULT '',
    imagen      TEXT,
    disponible  INTEGER DEFAULT 1,
    creado_en   TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario       TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  );
`);

// Verificar que existe al menos un usuario admin
const existing = db.prepare("SELECT id FROM admin_users WHERE usuario = ?").get("admin");
if (!existing) {
  console.warn("========================================================");
  console.warn("  AVISO: No existe usuario admin en la base de datos.");
  console.warn("  Ejecuta el script de setup para crear las credenciales:");
  console.warn("    node backend/scripts/create-admin.js");
  console.warn("========================================================");
}

module.exports = db;
