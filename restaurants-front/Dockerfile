# ── Stage 1: build ──────────────────────────────────────────────
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --quiet

COPY . .
RUN npm run build -- --configuration production

# ── Stage 2: serve ───────────────────────────────────────────────
FROM nginx:1.27-alpine

COPY --from=build /app/dist/restaurants-front/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
