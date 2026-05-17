/**
 * Script de setup: crea o actualiza el usuario admin en la base de datos.
 *
 * Uso (primera vez o para cambiar contraseña):
 *   ADMIN_PASSWORD=tu_contraseña node backend/scripts/create-admin.js
 */

const password = process.env.ADMIN_PASSWORD;
if (!password || password.length < 8) {
  console.error("ERROR: Define ADMIN_PASSWORD con al menos 8 caracteres.");
  console.error("Ejemplo:");
  console.error("  ADMIN_PASSWORD=MiPassword123 node backend/scripts/create-admin.js");
  process.exit(1);
}

const bcrypt = require("bcryptjs");
const db = require("../database");

const hash = bcrypt.hashSync(password, 12);
const existing = db.prepare("SELECT id FROM admin_users WHERE usuario = ?").get("admin");

if (existing) {
  db.prepare("UPDATE admin_users SET password_hash = ? WHERE usuario = ?").run(hash, "admin");
  console.log("Contrasena del usuario admin actualizada correctamente.");
} else {
  db.prepare("INSERT INTO admin_users (usuario, password_hash) VALUES (?, ?)").run("admin", hash);
  console.log("Usuario admin creado correctamente.");
}

process.exit(0);
