const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const db = require("../database");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error(
    "[auth] JWT_SECRET no está definido. " +
    "Configura esta variable de entorno antes de arrancar el servidor."
  );
}

// Máximo 10 intentos fallidos por IP cada 15 minutos
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos." },
  skipSuccessfulRequests: true,
});

router.post("/login", loginLimiter, (req, res) => {
  const { usuario, password } = req.body;
  if (!usuario || !password) {
    return res.status(400).json({ error: "Usuario y contraseña requeridos" });
  }

  const user = db.prepare("SELECT * FROM admin_users WHERE usuario = ?").get(usuario);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  const token = jwt.sign({ id: user.id, usuario: user.usuario }, JWT_SECRET, { expiresIn: "8h" });
  res.json({ token, usuario: user.usuario });
});

module.exports = router;
