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

`index.html` carga `assets/css/styles.css`, por eso los cambios de diseño deben hacerse en `assets/css/input.css` y luego compilar.
