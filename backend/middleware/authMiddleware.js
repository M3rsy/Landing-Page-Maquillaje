const jwt = require("jsonwebtoken");
const { AUTH_COOKIE_NAME } = require("../authCookie");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error(
    "[authMiddleware] JWT_SECRET no está definido. " +
    "Configura esta variable de entorno antes de arrancar el servidor."
  );
}

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
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
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
