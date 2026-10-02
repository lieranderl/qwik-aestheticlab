# syntax=docker/dockerfile:1@sha256:87999aa3d42bdc6bea60565083ee17e86d1f3339802f543c0d03998580f9cb89

FROM --platform=$BUILDPLATFORM oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 AS build
WORKDIR /app

COPY package.json bun.lock* ./
RUN --mount=type=cache,id=bun,target=/root/.bun/install/cache \
	bun install --frozen-lockfile

COPY . .
ENV NODE_ENV=production
RUN bun run build

FROM --platform=$BUILDPLATFORM oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895 AS prod-deps
WORKDIR /app
COPY package.json bun.lock* ./
RUN --mount=type=cache,id=bun,target=/root/.bun/install/cache \
	bun install --frozen-lockfile --production --ignore-scripts

FROM oven/bun:1.4.2-distroless@sha256:1a0c31c7c5f9d193aedf60fe1cebdeb76ac8f6e29f24be8dd8cbd6df72df26ec AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=prod-deps --chown=65532:65532 /app/node_modules ./node_modules
COPY --from=build --chown=65532:65532 /app/dist ./dist
COPY --from=build --chown=65532:65532 /app/public ./public
COPY --from=build --chown=65532:65532 /app/server ./server

USER 65532:65532

EXPOSE 3000

CMD ["server/entry.bun.js"]
