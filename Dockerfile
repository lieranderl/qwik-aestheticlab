# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS build
WORKDIR /app

RUN npm install -g bun

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY . .
ENV NODE_ENV=production
RUN bun run build

FROM oven/bun:latest AS prod-deps
WORKDIR /app

COPY package.json bun.lock* ./
RUN --mount=type=cache,id=bun,target=/root/.bun/install/cache \
    bun install --frozen-lockfile --production && \
    find node_modules -type d \( -name "test" -o -name "tests" -o -name "__tests__" -o -name "docs" \) -prune -exec rm -rf {} + && \
    find node_modules -type f \( -name "*.md" -o -name "*.ts" \) -delete

FROM oven/bun:distroless AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public
COPY --from=build /app/server ./server
COPY --from=build /app/package.json ./package.json

EXPOSE 3000

CMD ["server/entry.bun.js"]
