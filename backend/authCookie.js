const AUTH_COOKIE_NAME = "jrv_admin_token";
const DEFAULT_TOKEN_TTL_HOURS = 8;

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) return fallback;
  return parsed;
}

function getTokenTtlHours() {
  return parsePositiveInt(process.env.AUTH_TOKEN_TTL_HOURS, DEFAULT_TOKEN_TTL_HOURS);
}

function getSameSite() {
  const sameSite = (process.env.AUTH_COOKIE_SAMESITE || "lax").toLowerCase();
  if (sameSite === "strict" || sameSite === "none") return sameSite;
  return "lax";
}

function getSecureFlag(sameSite) {
  const raw = (process.env.AUTH_COOKIE_SECURE || "").toLowerCase();
  if (raw === "true") return true;
  if (raw === "false") return false;

  if (sameSite === "none") return true;
  return process.env.NODE_ENV === "production";
}

function getAuthCookieOptions() {
  const sameSite = getSameSite();
  const secure = getSecureFlag(sameSite);
  const options = {
    httpOnly: true,
    secure,
    sameSite,
    path: "/",
    maxAge: getTokenTtlHours() * 60 * 60 * 1000,
  };

  if (process.env.AUTH_COOKIE_DOMAIN) {
    options.domain = process.env.AUTH_COOKIE_DOMAIN;
  }

  return options;
}

module.exports = {
  AUTH_COOKIE_NAME,
  getAuthCookieOptions,
  getTokenTtlHours,
};
