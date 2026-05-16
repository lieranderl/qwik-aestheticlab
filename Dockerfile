# syntax=docker/dockerfile:1

# Stage 1: Base image for shared configuration
FROM oven/bun:1.3-slim AS base
WORKDIR /app

# Stage 2: Install all dependencies (for building)
FROM base AS build-deps
COPY package.json bun.lock* ./
RUN --mount=type=cache,id=bun,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

# Stage 3: Build the application
FROM build-deps AS build
COPY . .
ENV NODE_ENV=production
RUN bun run build

# Stage 4: Production dependencies only
FROM base AS prod-deps
COPY package.json bun.lock* ./
RUN --mount=type=cache,id=bun,target=/root/.bun/install/cache \
    bun install --frozen-lockfile --production && \
    # Remove unnecessary files from node_modules to reduce image size
    find node_modules -type d -name "test" -prune -exec rm -rf {} + && \
    find node_modules -type d -name "tests" -prune -exec rm -rf {} + && \
    find node_modules -type d -name "__tests__" -prune -exec rm -rf {} + && \
    find node_modules -type d -name "docs" -prune -exec rm -rf {} + && \
    find node_modules -type f -name "*.md" -delete && \
    find node_modules -type f -name "*.ts" -delete

# Stage 5: Final runtime image
FROM oven/bun:distroless AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copy production dependencies
COPY --from=prod-deps /app/node_modules ./node_modules

# Copy built assets and necessary files
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public
COPY --from=build /app/server ./server
COPY --from=build /app/package.json ./package.json

EXPOSE 3000

# Start the application using the bundled server entry point
CMD ["server/entry.bun.js"]
