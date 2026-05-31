const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const db = require("../database");
const requireAuth = require("../middleware/authMiddleware");
const logger = require("../logger");
const log = logger.child({ module: "auth" });
const {
  AUTH_COOKIE_NAME,
  getAuthCookieOptions,
  getTokenTtlHours,
} = require("../authCookie");
const {
  JWT_SECRET,
  LOCKOUT_THRESHOLD,
  LOCKOUT_DURATION_MS,
  DUMMY_HASH,
} = require("../config/auth");

const router = express.Router();

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

  if (typeof usuario !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Formato de credenciales inválido" });
  }

  if (usuario.length > 60 || password.length > 200) {
    return res.status(400).json({ error: "Credenciales inválidas" });
  }

  const user = db.prepare("SELECT * FROM admin_users WHERE usuario = ?").get(usuario);

  // Check lockout for existing users before credential verification
  if (user && user.locked_until && new Date(user.locked_until) > new Date()) {
    log.warn({ event: "login.lockout", usuario: user.usuario, reason: "cuenta ya bloqueada" }, "Cuenta bloqueada");
    return res.status(429).json({ error: "Cuenta bloqueada. Intenta de nuevo en unos minutos." });
  }

  // Timing-safe: always run bcrypt.compareSync, even for non-existent users
  const hashToCompare = user ? user.password_hash : DUMMY_HASH;
  const passwordOk = bcrypt.compareSync(password, hashToCompare);

  if (!user || !passwordOk) {
    if (!user) {
      log.warn({ event: "login.failure", usuario, reason: "usuario no encontrado" }, "Login fallido: usuario no encontrado");
    } else {
      const newAttempts = (user.failed_attempts || 0) + 1;
      const lockUntil = newAttempts >= LOCKOUT_THRESHOLD ? new Date(Date.now() + LOCKOUT_DURATION_MS).toISOString() : null;
      db.prepare("UPDATE admin_users SET failed_attempts = ?, locked_until = ? WHERE id = ?").run(newAttempts, lockUntil, user.id);
      if (lockUntil) {
        log.warn({ event: "login.lockout", usuario: user.usuario, failedAttempts: newAttempts, lockoutDurationMs: LOCKOUT_DURATION_MS }, "Cuenta bloqueada");
      }
      log.warn({ event: "login.failure", usuario: user.usuario, reason: "contraseña incorrecta" }, "Login fallido: contraseña incorrecta");
    }
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  // Successful login: reset attempts, clear lockout, update last login
  db.prepare("UPDATE admin_users SET failed_attempts = 0, locked_until = NULL, last_login_at = datetime('now') WHERE id = ?").run(user.id);
  log.info({ event: "login.success", usuario: user.usuario, userId: user.id }, "Login exitoso");

  const token = jwt.sign(
    { id: user.id, usuario: user.usuario, ver: user.token_version ?? 0 },
    JWT_SECRET,
    { expiresIn: `${getTokenTtlHours()}h` }
  );

  res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
  res.json({ usuario: user.usuario });
});

router.post("/revoke", requireAuth, (req, res) => {
  db.prepare("UPDATE admin_users SET token_version = token_version + 1 WHERE id = ?").run(req.admin.id);
  log.info({ event: "token.revoke", userId: req.admin.id, usuario: req.admin.usuario }, "Token revocado");
  // Clear the cookie
  const clearOptions = { ...getAuthCookieOptions() };
  delete clearOptions.maxAge;
  res.clearCookie(AUTH_COOKIE_NAME, clearOptions);
  res.json({ ok: true });
});

router.post("/logout", (req, res) => {
  log.info({ event: "auth.logout" }, "Logout");
  const clearCookieOptions = { ...getAuthCookieOptions() };
  delete clearCookieOptions.maxAge;

  res.clearCookie(AUTH_COOKIE_NAME, clearCookieOptions);
  res.status(204).end();
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ usuario: req.admin.usuario });
});

module.exports = router;
