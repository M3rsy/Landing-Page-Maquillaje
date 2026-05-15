const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "jrv_secret_2024";

router.post("/login", (req, res) => {
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
