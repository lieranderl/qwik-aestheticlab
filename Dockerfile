# Stage 1: Building the application
FROM --platform=$BUILDPLATFORM node:24-bookworm-slim AS build

# Set the working directory
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Install Bun package manager
RUN npm install -g bun

# Copy package.json and bun.lockb (if available) for dependency installation
COPY package.json bun.lock  /app/

# Install project dependencies
RUN bun install

# Copy only necessary files for the build
COPY . .
ARG SUPABASE_URL
ARG SUPABASE_KEY
ENV SUPABASE_URL=${SUPABASE_URL}
ENV SUPABASE_KEY=${SUPABASE_KEY}

# Build the application
RUN bun run build

# Stage 2: Setup the runtime environment
FROM oven/bun:distroless

# Set the working directory for the runtime environment
WORKDIR /app

# Copy the built application and necessary files from the build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/public ./public
# If server directory contains server-side code necessary for running the app, include it, otherwise omit.
COPY --from=build /app/server ./server

# Adjust permissions for the user that will run the app
# RUN chown -R 1001:0 /app && chmod -R 777 /app

# USER 1001

# Expose the server port
EXPOSE 3000

# Start the application using Bun
CMD ["server/entry.bun.js"]
