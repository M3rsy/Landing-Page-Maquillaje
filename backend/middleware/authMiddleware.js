const jwt = require("jsonwebtoken");
const { AUTH_COOKIE_NAME } = require("../authCookie");
const { JWT_SECRET } = require("../config/auth");
const db = require("../database");

function requireAuth(req, res, next) {
  const header = req.headers["authorization"];
  const bearerToken = header && header.startsWith("Bearer ") ? header.slice(7) : null;
  const cookieToken = getCookieValue(req.headers.cookie, AUTH_COOKIE_NAME);
  const token = bearerToken || cookieToken;

  if (!token) {
    return res.status(401).json({ error: "No autorizado" });
  }

  try {
    req.admin = jwt.verify(token, JWT_SECRET);
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }

  // Check token version for revocation
  if (req.admin && typeof req.admin.id === "number") {
    const current = db.prepare("SELECT token_version FROM admin_users WHERE id = ?").get(req.admin.id);
    if (current) {
      const dbVer = current.token_version ?? 0;
      const payloadVer = typeof req.admin.ver === "number" ? req.admin.ver : 0;
      if (payloadVer !== dbVer) {
        return res.status(401).json({ error: "Sesión revocada. Iniciá sesión de nuevo." });
      }
    }
  }

  next();
}

function getCookieValue(cookieHeader, name) {
  if (!cookieHeader) return null;

  const pairs = cookieHeader.split(";");
  for (const pair of pairs) {
    const separatorIndex = pair.indexOf("=");
    if (separatorIndex === -1) continue;
    const key = pair.slice(0, separatorIndex).trim();
    if (key !== name) continue;
    return decodeURIComponent(pair.slice(separatorIndex + 1).trim());
  }

  return null;
}

module.exports = requireAuth;
