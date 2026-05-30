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

# 3. Seed del catálogo base de productos (idempotente para bootstrap)
npm run seed:products
# Nota: en productos existentes conserva precio/costo/precio mayorista/disponibilidad.

# 4. Crear el usuario admin (solo la primera vez)
# Agrega ADMIN_PASSWORD en .env, luego:
npm run create-admin

# 5. Iniciar el servidor (carga .env automáticamente)
npm start
# → http://localhost:3000
# → http://localhost:3000/admin/
# → http://localhost:3000/health  ← verificación rápida
```

Para desarrollo con recarga automática:

```bash
npm run dev
```

### Smoke tests (Playwright)

Pruebas mínimas de humo para el catálogo público (`/`): carga base, fallback de API y visibilidad de precio mayorista.
La suite mockea `/api/products`, por lo que no depende de datos sembrados en DB.

```bash
# Instalar navegador de Playwright (solo la primera vez)
npx playwright install chromium

# Ejecutar smoke suite en Chromium
npm run test:smoke

# Abrir runner interactivo
npm run test:smoke:ui
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

### Flujo admin -> API -> frontend (catálogo)

Ruta corta para mantenimiento del flujo de productos.

1. Admin inicia sesión en `/admin/` (`POST /api/auth/login`), el backend valida credenciales en `admin_users` y guarda JWT en cookie httpOnly.
2. Dashboard carga productos con `GET /api/products/admin/list` (autenticado), permite crear/editar (`POST`/`PUT /api/products/:id`) y eliminar (`DELETE /api/products/:id`).
3. Si se adjunta imagen, admin sube archivo con `POST /api/products/:id/image` (`multipart/form-data`, campo `imagen`), se guarda en disco y se persiste la URL en DB.
4. Frontend público consume `GET /api/products` al cargar `/`, normaliza la respuesta y renderiza catálogo/estado sin exponer costo interno.

**Persistencia (SQLite)**
- DB en `DB_PATH` (default `backend/jrv.db`), tabla principal `products`; `node:sqlite` en modo WAL.
- El backend crea tablas al iniciar (`products`, `admin_users`) y agrega `precio_mayorista` si falta.

**Límites de API (público vs admin)**
- Público: `GET /api/products`, `GET /api/products/:id` (sin JWT, incluye `precio` y `precio_mayorista`, no incluye `costo`).
- Admin (JWT requerido): `GET /api/products/admin/list`, `POST/PUT/DELETE /api/products`, `POST /api/products/:id/image`.

**Semántica de campos de producto**

| Campo | Significado operativo |
|------|------------------------|
| `precio` | Precio de venta al cliente final (visible en frontend). |
| `costo` | Costo interno del negocio (solo admin/list y escritura admin). |
| `precio_mayorista` | Precio por volumen; puede ser `null` y el frontend lo trata como opcional. |
| `imagen` | Ruta de imagen en catálogo (`/uploads/<archivo>` o asset estático). |
| `disponible` | Disponibilidad lógica (`1/0` en SQLite) que frontend mapea a `available/soldout`. |

**Uploads y serving de imágenes**
- Upload físico: `UPLOADS_DIR` (default `backend/uploads`), tamaño máximo 5 MB, solo MIME `image/*`.
- Serving público: `GET /uploads/*` por `express.static`; el `imagen` guardado en DB se publica tal cual en el catálogo.

**Bootstrap recomendado**
- `npm run seed:products`: sincroniza catálogo base por `codigo` (idempotente), conserva `precio/costo/precio_mayorista/disponible` en productos ya existentes.
- `npm run create-admin`: crea o actualiza usuario `admin` usando `ADMIN_PASSWORD`.

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
