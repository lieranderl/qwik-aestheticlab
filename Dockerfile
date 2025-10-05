# Stage 1: Building the application
FROM oven/bun:slim AS build

WORKDIR /app
ENV NODE_ENV=production

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# Stage 2: Production dependencies only
FROM oven/bun:slim AS deps

WORKDIR /app
ENV NODE_ENV=production

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile --production && \
    rm -rf node_modules/**/*.md \
    node_modules/**/test \
    node_modules/**/tests \
    node_modules/**/__tests__ \
    node_modules/**/docs \
    node_modules/**/*.ts \
    node_modules/**/.github

# Stage 3: Runtime
FROM oven/bun:distroless

WORKDIR /app
ENV NODE_ENV=production

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy built assets
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public
COPY --from=build /app/server ./server
COPY --from=build /app/package.json ./package.json

EXPOSE 3000
CMD ["server/entry.bun.js"]
