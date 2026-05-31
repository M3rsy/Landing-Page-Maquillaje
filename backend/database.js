const { DatabaseSync } = require("node:sqlite");
const path = require("path");

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "jrv.db");
let db;
try {
  db = new DatabaseSync(DB_PATH);
} catch (err) {
  if (err.message && err.message.includes("SQLITE_CANTOPEN")) {
    throw new Error(
      `No se puede abrir la base de datos en: ${DB_PATH}. Verificá que el directorio exista y tenga permisos de escritura.`
    );
  }
  throw new Error(
    `Error al inicializar la base de datos: ${err.message}. Ruta: ${DB_PATH}`
  );
}

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

const productColumns = db
  .prepare("PRAGMA table_info(products)")
  .all()
  .map((column) => column.name);
if (!productColumns.includes("precio_mayorista")) {
  db.exec("ALTER TABLE products ADD COLUMN precio_mayorista REAL");
}

const adminColumns = db.prepare("PRAGMA table_info(admin_users)").all().map((c) => c.name);
if (!adminColumns.includes("token_version")) {
  db.exec("ALTER TABLE admin_users ADD COLUMN token_version INTEGER DEFAULT 0");
}
if (!adminColumns.includes("failed_attempts")) {
  db.exec("ALTER TABLE admin_users ADD COLUMN failed_attempts INTEGER DEFAULT 0");
}
if (!adminColumns.includes("locked_until")) {
  db.exec("ALTER TABLE admin_users ADD COLUMN locked_until TEXT");
}
if (!adminColumns.includes("last_login_at")) {
  db.exec("ALTER TABLE admin_users ADD COLUMN last_login_at TEXT");
}

// Backfill existing rows so old tokens remain valid (token_version defaults to 0)
db.exec("UPDATE admin_users SET token_version = COALESCE(token_version, 0)");
db.exec("UPDATE admin_users SET failed_attempts = COALESCE(failed_attempts, 0)");

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
