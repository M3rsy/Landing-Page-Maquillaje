const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const path = require("path");

const DB_PATH = path.join(__dirname, "jrv.db");
const db = new Database(DB_PATH);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo      TEXT    UNIQUE NOT NULL,
    titulo      TEXT    NOT NULL,
    descripcion TEXT,
    precio      REAL    NOT NULL,
    costo       REAL    NOT NULL,
    categoria   TEXT    NOT NULL,
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

// Crear usuario admin por defecto si no existe
const existing = db.prepare("SELECT id FROM admin_users WHERE usuario = ?").get("admin");
if (!existing) {
  const hash = bcrypt.hashSync("jrv2024", 10);
  db.prepare("INSERT INTO admin_users (usuario, password_hash) VALUES (?, ?)").run("admin", hash);
  console.log("Usuario admin creado: admin / jrv2024");
}

module.exports = db;
