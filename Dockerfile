# Backend Node.js (Express) + SQLite para JOYERIA JRV
# Sirve landing estática, panel admin y API en un solo puerto.

FROM node:20-alpine

# better-sqlite3 requiere compilación nativa
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Instalar solo dependencias de producción (excluye htmlhint, tailwindcss, terser)
COPY package*.json ./
RUN npm ci --omit=dev

# Copiar el resto del código (respeta .dockerignore)
COPY . .

# Puerto interno donde escucha Express (debe coincidir con Container Port en Dokploy)
EXPOSE 3000

# Arrancar el servidor directamente (sin --env-file; Dokploy inyecta env vars a process.env)
CMD ["node", "backend/server.js"]
