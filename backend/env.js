/**
 * Shared environment bootstrap.
 *
 * Loads variables from `.env` into `process.env` before any env consumer runs.
 * Import this module as the FIRST side-effecting import in every entrypoint:
 *
 *   require('./env');          // backend/server.js
 *   require('../env');         // backend/scripts/create-admin.js
 *
 * Behaviour mirrors Node's --env-file-if-exists=.env flag:
 *  - If .env is absent, continues silently (no error thrown).
 *  - Already-set env vars are NOT overwritten (shell exports take precedence).
 *  - Supports comments (#), blank lines, and optional surrounding quotes.
 */

"use strict";

const fs = require("node:fs");
const path = require("node:path");

const envPath = path.resolve(process.cwd(), ".env");

if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const raw of lines) {
    const line = raw.trim();

    // Skip blank lines and comments
    if (!line || line.startsWith("#")) continue;

    const eqIdx = line.indexOf("=");
    if (eqIdx < 1) continue;

    const key = line.slice(0, eqIdx).trim();
    let val = line.slice(eqIdx + 1).trim();

    // Strip optional surrounding quotes (single or double)
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }

    // Only set if not already defined (--env-file-if-exists semantics)
    if (!(key in process.env)) {
      process.env[key] = val;
    }
  }
}
