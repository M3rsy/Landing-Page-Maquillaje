# ── Stage 1: build ───────────────────────────────────────────────────────────
# Install ALL deps (incl. devDependencies) and compile CSS + JS assets.
FROM node:26-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 2: production ───────────────────────────────────────────────────────
# node:sqlite is a Node 26 built-in — no native build toolchain needed.
FROM node:26-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source (backend, static pages, admin panel).
COPY --from=build /app/backend ./backend
COPY --from=build /app/admin   ./admin
COPY --from=build /app/index.html ./index.html
COPY --from=build /app/robots.txt ./robots.txt
COPY --from=build /app/sitemap.xml ./sitemap.xml

# Copy compiled CSS/JS assets produced by Stage 1.
COPY --from=build /app/assets ./assets

EXPOSE 3000

CMD ["npm", "start"]
