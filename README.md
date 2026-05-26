# JOYERIA JRV Landing

Landing estatica para catalogo de maquillaje con pedidos por WhatsApp.

## Backend

El proyecto incluye un servidor Express que sirve el sitio estático y expone una API de administración.

> **Requisito de Node**: Este proyecto requiere **Node 26** (`>=26.0.0`).
> El backend usa `node:sqlite` (módulo nativo de Node 26) — no se compila ningún addon nativo.
> Verificá tu versión con `node --version` antes de instalar.

### Inicio rapido (desarrollo local)

```bash
# 1. Instalar dependencias
npm ci

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con los valores reales (JWT_SECRET es obligatorio)

# 3. Crear el usuario admin (solo la primera vez)
# Agrega ADMIN_PASSWORD en .env, luego:
npm run create-admin

# 4. Iniciar el servidor (carga .env automáticamente)
npm start
# → http://localhost:3000
# → http://localhost:3000/admin/
# → http://localhost:3000/health  ← verificación rápida
```

Para desarrollo con recarga automática:

```bash
npm run dev
```

### Variables de entorno

Copiar `.env.example` como `.env` y completar:

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `JWT_SECRET` | Sí | Secreto para firmar tokens. Generar con `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `PORT` | No | Puerto del servidor (default: `3000`) |
| `CORS_ORIGIN` | No | Orígenes permitidos separados por coma. Vacío = mismo dominio |
| `NODE_ENV` | No | `production` activa HSTS y cookies seguras (default: `production`) |
| `AUTH_TOKEN_TTL_HOURS` | No | Duración del token JWT en horas (default: `8`) |
| `AUTH_COOKIE_SAMESITE` | No | `lax`, `strict` o `none` (default: `lax`) |
| `AUTH_COOKIE_SECURE` | No | `true` o `false`. Si no se define, se infiere desde `NODE_ENV` |
| `AUTH_COOKIE_DOMAIN` | No | Dominio de la cookie (útil para subdominios) |
| `DB_PATH` | No | Ruta al archivo SQLite (default: `backend/jrv.db`) |
| `UPLOADS_DIR` | No | Directorio de uploads (default: `backend/uploads`) |

### Deploy con Docker

```bash
# Construir la imagen
docker build -t jrv .

# Ejecutar en producción
docker run -d \
  -p 3000:3000 \
  -e JWT_SECRET=<secreto-seguro> \
  -e NODE_ENV=production \
  -e DB_PATH=/app/backend/data/jrv.db \
  -e UPLOADS_DIR=/app/backend/data/uploads \
  -v /data/jrv:/app/backend/data \
  --name jrv \
  jrv
```

La imagen usa un build multistage:
- **Stage 1**: compila CSS y JS con todas las dependencias de desarrollo.
- **Stage 2**: instala solo dependencias de producción (`npm ci --omit=dev`) y copia los assets compilados. Sin herramientas de build en producción.

---

## Estilos (Tailwind)

- CSS fuente: `assets/css/input.css`
- CSS publicado: `assets/css/styles.css`
- CSS minificado: `assets/css/styles.min.css`
- Configuracion: `tailwind.config.js`

Compilar estilos y JS (cross-platform, requiere Node):

```bash
npm run build
```

Compilar solo estilos:

```bash
npm run build:css:npm
```

Modo observador (PowerShell):

```powershell
powershell -ExecutionPolicy Bypass -File scripts/watch-css.ps1
```

`index.html` carga `assets/css/styles.min.css?v=...` y `assets/js/script.min.js?v=...`. Los cambios deben hacerse en los archivos fuente y luego compilar.

---

## Agregar videos de Instagram

La seccion `Videos de clientas` esta en `index.html`, dentro del bloque `#videos`.

Para agregar otro Reel:

1. Copia una tarjeta `<article class="video-card">`.
2. Cambia el titulo visible dentro de `<h3>`.
3. Cambia el codigo del Reel en el `iframe` y en el enlace de respaldo.

Ejemplo de URL embebida:

```html
https://www.instagram.com/reel/CODIGO_DEL_REEL/embed/
```

---

## Deploy estatico / CDN

Si editas `assets/js/script.js`, volve a minificar antes de deploy:

```bash
npm run build:js
```

Antes de deploy, actualiza la version de assets para evitar cache viejo en CDN:

```bash
npm run bump:assets
```

Tambien puedes setear una version manual (ejemplo: hash de commit):

```bash
node scripts/bump-asset-version.mjs a24ab8e
```
