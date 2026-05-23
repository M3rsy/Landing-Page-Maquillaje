import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(process.cwd());
const indexPath = path.join(projectRoot, "index.html");
const indexContent = fs.readFileSync(indexPath, "utf8");

const versionArg = process.argv[2];
const version = versionArg && versionArg.trim().length > 0
  ? versionArg.trim()
  : new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);

const next = indexContent
  .replace(/assets\/css\/styles\.min\.css\?v=[^"']+/g, `assets/css/styles.min.css?v=${version}`)
  .replace(/assets\/js\/script\.min\.js\?v=[^"']+/g, `assets/js/script.min.js?v=${version}`);

if (next === indexContent) {
  throw new Error("No se encontraron tags versionables en index.html");
}

fs.writeFileSync(indexPath, next, "utf8");
console.log(`Asset version updated to: ${version}`);
