# JOYERIA JRV Landing

Landing estatica para catalogo de maquillaje con pedidos por WhatsApp.

## Tailwind local

- CSS fuente: `assets/css/input.css`
- CSS publicado: `assets/css/styles.css`
- CSS minificado: `assets/css/styles.min.css`
- Configuracion: `tailwind.config.js`
- Compilador local opcional: `tools/tailwindcss.exe`

Si el compilador local no existe, descargalo con:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/download-tailwind.ps1
```

Compilar estilos:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/build-css.ps1
```

Modo observador mientras editas:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/watch-css.ps1
```

`index.html` carga `assets/css/styles.css`, por eso los cambios de diseno deben hacerse en `assets/css/input.css` y luego compilar.

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

Despues de modificar estilos en `assets/css/input.css`, vuelve a compilar Tailwind.

## Backend — Setup y arranque

El backend Express gestiona el catalogo de productos y el panel de administracion en `/admin/`.

### Requisitos

- Node.js 18 o superior

### Instalacion

```bash
npm install
```

### Configuracion de entorno

```bash
cp .env.example .env
```

Edita `.env` y completa los valores:

1. Genera `JWT_SECRET`:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   Copia el resultado en `JWT_SECRET=` dentro del `.env`.

2. `CORS_ORIGIN` solo es necesario si el frontend se sirve desde un dominio diferente al backend.

### Crear credenciales del admin (solo la primera vez)

```bash
ADMIN_PASSWORD=tu_contraseña_segura node backend/scripts/create-admin.js
```

Para cambiar la contraseña en el futuro, ejecuta el mismo comando con la nueva contraseña.

### Arrancar el servidor

```bash
npm start
```

El panel de administracion queda en `http://localhost:3000/admin/`.

### Variables de entorno

| Variable | Obligatoria | Descripcion |
|---|---|---|
| `JWT_SECRET` | Si | Secreto para firmar tokens JWT. Minimo 32 caracteres. |
| `PORT` | No | Puerto del servidor (default: 3000). |
| `CORS_ORIGIN` | No | Origenes CORS separados por coma. Vacio = mismo dominio. |
| `ADMIN_PASSWORD` | Solo setup | Contrasena para `create-admin.js`. No necesaria despues. |
