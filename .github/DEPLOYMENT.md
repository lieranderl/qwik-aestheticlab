# Deployment Guide

This document covers the build pipeline, Docker containerization, and deployment process for the Aesthetic Lab project.

## Build Pipeline

### Local Development

```bash
bun run dev        # Starts Vite dev server with SSR mode
# or
make dev
```

The dev server runs at `http://localhost:5173` with:
- Hot module replacement (HMR).
- Server-side rendering (SSR) enabled via `--mode ssr`.
- No caching (`Cache-Control: public, max-age=0`).

### Production Build

```bash
bun run build
```

This runs `qwik build`, which triggers three sequential steps:

1. **Client build** (`build.client`) — Vite bundles the client-side assets into `dist/`.
2. **Server build** (`build.server`) — Vite bundles the Bun server adapter into `server/`.
3. **qwik-speak inline** — The `qwikSpeakInline` Vite plugin inlines all translations at build time for each supported locale.

Output directories:

| Directory | Contents |
|-----------|----------|
| `dist/` | Client-side static assets (JS, CSS, images) |
| `server/` | Server entry point (`entry.bun.js`) |
| `public/` | Static files served as-is (fonts, manifest, favicon) |

### Type Checking

```bash
bun run build.types
```

Runs `tsc --incremental --noEmit` — type checks without emitting files. Use this to catch type errors without a full build.

## Docker

### Dockerfile Overview

The Dockerfile uses a **three-stage build** for minimal image size:

| Stage | Base Image | Purpose |
|-------|-----------|---------|
| `build` | `oven/bun:slim` | Install all deps, run `bun run build` |
| `deps` | `oven/bun:slim` | Install production deps only, strip unnecessary files |
| `runtime` | `oven/bun:distroless` | Copy built assets + prod deps, run the server |

The final image contains only:
- Production `node_modules` (no dev dependencies, no docs, no tests).
- Built `dist/`, `server/`, and `public/` directories.
- `package.json` for module resolution.

### Building the Docker Image

```bash
make docker-build-push TAG=staging-v1
```

Or manually:

```bash
docker buildx build \
  --platform linux/amd64 \
  --provenance=false \
  --sbom=false \
  -t furlingene/qwik-aesthetic:TAG \
  --push .
```

Key details:
- Target platform: `linux/amd64` (Google Cloud Run requirement).
- `--provenance=false --sbom=false` — reduces image size by skipping attestation metadata.
- Images are pushed to Docker Hub under `furlingene/qwik-aesthetic`.

### Running the Container Locally

```bash
docker run -p 3000:3000 \
  -e SUPABASE_URL=https://your-project.supabase.co \
  -e SUPABASE_KEY=your-anon-key \
  furlingene/qwik-aesthetic:TAG
```

The container:
- Exposes port `3000`.
- Runs `bun server/entry.bun.js` as the entrypoint.
- Requires `SUPABASE_URL` and `SUPABASE_KEY` environment variables.

## Google Cloud Run Deployment

### Deploy Command

```bash
make gcloud-deploy TAG=staging-v1
```

Or manually:

```bash
gcloud run deploy aestheticlab-web \
  --image=furlingene/qwik-aesthetic:TAG \
  --region=europe-west1 \
  --project=nail-lab-449417
```

### Configuration

| Setting | Value |
|---------|-------|
| Service name | `aestheticlab-web` |
| Region | `europe-west1` (Belgium) |
| GCP Project | `nail-lab-449417` |
| Image registry | Docker Hub (`furlingene/qwik-aesthetic`) |

### Environment Variables on Cloud Run

Set these in the Cloud Run service configuration (console or CLI):

| Variable | Purpose | Required |
|----------|---------|----------|
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_KEY` | Supabase anon key | Yes |
| `NODE_ENV` | Set to `production` (already set in Dockerfile) | Auto |

To update env vars via CLI:

```bash
gcloud run services update aestheticlab-web \
  --region=europe-west1 \
  --set-env-vars="SUPABASE_URL=https://xxx.supabase.co,SUPABASE_KEY=xxx"
```

## CI/CD — GitHub Actions

### Lint Workflow

File: `.github/workflows/lint.yaml`

Runs Biome linting on push and PR to ensure code quality.

### Deploy Workflow

File: `.github/workflows/deploy.yml`

Automates the build → push → deploy pipeline. Triggered on pushes to the deployment branch.

## Environment Variables Reference

| Variable | Used In | Purpose |
|----------|---------|---------|
| `SUPABASE_URL` | `shared/supabase-client.ts` via `event.env.get()` | Supabase project URL |
| `SUPABASE_KEY` | `shared/supabase-client.ts` via `event.env.get()` | Supabase anonymous/service key |
| `NODE_ENV` | Dockerfile, runtime | Set to `production` in Docker |

### Local Development Environment

For local dev, create a `.env` file at the project root (Vite auto-loads it):

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

The `.env` file is gitignored — never commit credentials.

## Caching Strategy

### HTTP Caching (Runtime)

Configured in `src/routes/[...lang]/layout.tsx`:

```tsx
cacheControl({
  staleWhileRevalidate: 60 * 60 * 24 * 7,  // 7 days
  maxAge: 5,                                 // 5 seconds
});
```

- First 5 seconds: serve fresh response.
- After 5 seconds: serve stale response while revalidating in the background.
- Stale window: 7 days.

This applies to all routes under `[...lang]/`.

### Static Asset Caching

Vite-built assets in `dist/` have content-hash filenames (e.g., `chunk-abc123.js`). Serve these with long-lived cache headers. Cloud Run and CDN layers handle this automatically for hashed assets.

### Build-Time Inlining

Translations are inlined at build time by `qwikSpeakInline`. This means:
- Zero runtime cost for translation lookups.
- Locale JSON files are NOT shipped to the client.
- A rebuild is required after changing translation files.

## Deployment Checklist

Before deploying to production:

- [ ] `bun run biome` passes with no errors.
- [ ] `bun run build` completes successfully.
- [ ] `bun run build.types` reports no type errors.
- [ ] New translation keys have been extracted: `bun run qwik-speak-extract`.
- [ ] All locale `app.json` files have been updated with translations.
- [ ] Environment variables (`SUPABASE_URL`, `SUPABASE_KEY`) are set on the target environment.
- [ ] Docker image builds and runs locally with correct data rendering.
- [ ] No hardcoded development URLs or debug code left in the codebase.

## Rollback

To roll back to a previous version on Cloud Run:

```bash
# List recent revisions
gcloud run revisions list --service=aestheticlab-web --region=europe-west1

# Route traffic to a previous revision
gcloud run services update-traffic aestheticlab-web \
  --region=europe-west1 \
  --to-revisions=REVISION_NAME=100
```

Or redeploy the previous Docker image tag:

```bash
make gcloud-deploy TAG=previous-tag
```

## Troubleshooting

### Build Failures

| Symptom | Cause | Fix |
|---------|-------|-----|
| `Invalid module "@qwik-city-plan"` | Qwik packages in `dependencies` instead of `devDependencies` | Move `@builder.io/qwik` and `@builder.io/qwik-city` to `devDependencies` |
| Duplicate dependency error | Same package in both `dependencies` and `devDependencies` | Remove from `dependencies`, keep in `devDependencies` |
| Translation keys missing in build | New `t()` calls not extracted | Run `bun run qwik-speak-extract` |
| Type errors on build | TypeScript strict mode violations | Fix types — do not use `@ts-ignore` |

### Runtime Issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| Blank page / 500 error | Missing `SUPABASE_URL` or `SUPABASE_KEY` | Set environment variables on the host |
| Data not loading | Supabase query errors | Check Cloud Run logs for `console.error` output from loaders |
| Stale content after data update | HTTP cache serving old response | Wait for `maxAge` (5s) to expire, or redeploy |
| Wrong language content | Locale not resolving | Verify URL has correct lang prefix (e.g., `/fr-BE/`) |