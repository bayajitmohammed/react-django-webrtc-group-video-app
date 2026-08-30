# --- Base: shared by dev and prod ---
FROM oven/bun:1 AS base

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

# --- Development ---
FROM base AS dev

EXPOSE 5173

CMD ["bun", "run", "dev", "--host", "0.0.0.0"]

# --- Build (production assets) ---
FROM base AS build

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN bun run build

# --- Production ---
FROM nginx:1.27-alpine AS prod

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
