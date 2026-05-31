const bcrypt = require("bcryptjs");
const { AUTH_COOKIE_NAME } = require("../authCookie");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET no está definido. Configura esta variable de entorno antes de arrancar el servidor."
  );
}

const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000;
const DUMMY_HASH = bcrypt.hashSync("timing-guard", 12);

function generateDummyHash() {
  return bcrypt.hashSync("timing-guard", 12);
}

module.exports = {
  JWT_SECRET,
  AUTH_COOKIE_NAME,
  LOCKOUT_THRESHOLD,
  LOCKOUT_DURATION_MS,
  DUMMY_HASH,
  generateDummyHash,
};
