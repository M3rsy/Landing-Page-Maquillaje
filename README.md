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

`index.html` carga `assets/css/styles.min.css` y `assets/js/script.min.js`, por eso los cambios deben hacerse en los archivos fuente (`assets/css/input.css` y `assets/js/script.js`) y luego compilar/minificar.

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

## Deploy estatico

Este proyecto se publica como sitio estatico.

- Archivo principal: `index.html`
- Catalogo de productos: `assets/js/script.js`
- JS publicado: `assets/js/script.min.js`

Si editas `assets/js/script.js`, volve a minificar antes de deploy:

```bash
npm run build:js
```
