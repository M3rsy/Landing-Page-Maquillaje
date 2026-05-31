const fs = require("fs");
const path = require("path");
const logger = require("./logger");

/**
 * Validates persistence prerequisites before server startup.
 * Throws Error with Spanish-language message on failure.
 * @param {object} [options] - Override paths for testing
 * @param {string} [options.dbPath]     - Database file path
 * @param {string} [options.uploadsDir] - Uploads directory
 */
function runHealthChecks(options = {}) {
  const dbPath =
    options.dbPath || process.env.DB_PATH || path.join(__dirname, "jrv.db");
  const uploadsDir =
    options.uploadsDir ||
    process.env.UPLOADS_DIR ||
    path.join(__dirname, "uploads");

  // Validate DB parent directory exists and is writable
  const dbParentDir = path.dirname(dbPath);
  if (!fs.existsSync(dbParentDir)) {
    throw new Error(
      `No se encuentra el directorio de la base de datos: ${dbParentDir}. Creá el directorio o verificá DB_PATH.`
    );
  }
  try {
    fs.accessSync(dbParentDir, fs.constants.W_OK);
  } catch {
    throw new Error(
      `No se puede escribir en el directorio de la base de datos: ${dbParentDir}. Verificá los permisos o DB_PATH.`
    );
  }

  // Validate UPLOADS_DIR: create if missing, then check writable
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  try {
    fs.accessSync(uploadsDir, fs.constants.W_OK);
  } catch {
    throw new Error(
      `No se puede escribir en el directorio de uploads: ${uploadsDir}. Verificá los permisos o UPLOADS_DIR.`
    );
  }

  logger.info("[health-checks] Validación de persistencia correcta");
}

module.exports = { runHealthChecks };
