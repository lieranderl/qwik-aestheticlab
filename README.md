# Aesthetic Lab

![Release](https://img.shields.io/github/v/release/lieranderl/qwik-aestheticlab?style=flat&logo=github)
[![Deploy to Cloud Run](https://github.com/lieranderl/qwik-aestheticlab/actions/workflows/deploy.yml/badge.svg?branch=staging)](https://github.com/lieranderl/qwik-aestheticlab/actions/workflows/deploy.yml)
![Qwik](https://img.shields.io/badge/Qwik-%2318B6F6.svg?style=flat&logo=qwik&logoColor=white)
![DaisyUI](https://img.shields.io/badge/daisyUI-5A0EF8?style=flat&logo=daisyui&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-%2338B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-%233ECF8E.svg?style=flat&logo=supabase&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=flat&logo=bun&logoColor=white)
![Biome](https://img.shields.io/badge/Biome-%23F9A42F.svg?style=flat&logo=biome&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

Aesthetic Lab is a multilingual marketing and booking site for a beauty studio in Belgium. It is built with Qwik City SSR, Qwik Speak, Supabase-backed service data, DaisyUI 5, Tailwind CSS 4, Bun, and a hardened Cloud Run delivery pipeline.

## Key Features

- Multilingual public site for `en-BE`, `nl-BE`, `fr-BE`, `ru-BE`, and `uk-BE`.
- Qwik City SSR with Bun runtime and resumable Qwik components.
- Supabase SSR data loading from the `gettimely` schema for contacts, service groups, services, and staff.
- Locale-aware service/pricelist content mapped server-side before it reaches UI components.
- GetTimely booking iframe, Google Maps embed, Google Analytics Consent Mode v2, and GDPR cookie consent.
- Security headers, gzip compression, static asset caching, `/healthz`, `/readyz`, and `/dependencyz` endpoints.
- GitHub Actions delivery to Cloud Run with pinned actions, OIDC/WIF, Artifact Registry, provenance attestations, Trivy scanning, canary promotion, and rollback safety.

## Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Commands](#available-commands)
- [Architecture](#architecture)
- [Data Loading](#data-loading)
- [Internationalization](#internationalization)
- [Testing and Verification](#testing-and-verification)
- [Local Docker Runtime](#local-docker-runtime)
- [Deployment](#deployment)
- [Infrastructure](#infrastructure)
- [Operations](#operations)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Tech Stack

| Area | Technology |
| --- | --- |
| Runtime | Bun `1.3.14` |
| Framework | Qwik `1.20` and Qwik City |
| Language | TypeScript |
| Styling | Tailwind CSS `4`, DaisyUI `5`, CSS-first Vite integration |
| i18n | Qwik Speak with build-time inline translations |
| Data | Supabase SSR client, read-only `gettimely` schema |
| Testing | Vitest, Playwright |
| Formatting and linting | Biome |
| Container | Multi-stage Dockerfile using pinned Bun images and distroless runtime |
| Deployment | GitHub Actions, Google Artifact Registry, Cloud Run |
| Infrastructure | OpenTofu in `infra/` |

## Prerequisites

- Bun `1.3.14` or compatible with the pinned `packageManager` field.
- Node.js `^20.3.0` or `>=21.0.0` for tooling compatibility.
- Docker with Buildx for container checks.
- Playwright browser dependencies when running E2E tests locally.
- Supabase project or local Supabase-compatible endpoint for realistic data loading.
- Google Cloud CLI and OpenTofu only for infrastructure or manual deployment diagnostics.
- GitHub CLI only for release/deployment operations.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/lieranderl/qwik-aestheticlab.git
cd qwik-aestheticlab
```

### 2. Install Dependencies

Use Bun. Do not switch to npm, pnpm, or yarn for this repository.

```bash
bun install
```

### 3. Configure Environment

Copy the sample file and fill in the Supabase values:

```bash
cp .env.example .env
```

Development can render with placeholder values, but real Supabase-backed pages and readiness checks require a valid URL and publishable or anon key.

### 4. Start the Development Server

```bash
bun run dev
```

Or through the Makefile wrapper:

```bash
make dev
```

Open [http://localhost:5173](http://localhost:5173).

### 5. Run a Full Local Verification

```bash
bun run verify
```

This runs Biome, TypeScript type checking, Vitest, and a production Qwik build.

## Environment Variables

### Application Runtime

| Variable | Required | Used by | Description |
| --- | --- | --- | --- |
| `SUPABASE_URL` | Yes | Qwik loaders, readiness checks, Cloud Run | Supabase project URL. Must be `https://...` outside local development. |
| `SUPABASE_KEY` | Yes | Qwik loaders, readiness checks, Cloud Run | Supabase publishable or anon key. `service_role` and `sb_secret_*` keys are intentionally rejected. |
| `PORT` | No | Bun server | HTTP port. Defaults to `3000` in the production runtime. |
| `NODE_ENV` | No | Build/runtime | Set to `production` inside the Docker runtime. |

The application reads Supabase values server-side through `event.env.get()` or `Bun.env`. They are not bundled into browser code.

### GitHub Actions Repository Variables

| Variable | Scope | Description |
| --- | --- | --- |
| `GCP_PROJECT` | Repository | Google Cloud project ID. |
| `GCP_REGION` | Repository | Cloud Run and Artifact Registry region. |
| `GAR_REPOSITORY` | Repository | Artifact Registry Docker repository. |
| `IMAGE_NAME` | Repository | Container image name. |
| `STAGE_SERVICE` | Repository | Staging Cloud Run service. |
| `PROD_SERVICE` | Repository | Production Cloud Run service. |
| `PROD_URL` | Repository | Canonical production URL, without trailing slash. |
| `MONITORING_NOTIFICATION_CHANNEL_IDS` | Repository | JSON list of existing Monitoring notification channel resource names. |
| `GCP_WORKLOAD_ID_PROVIDER` | Environment | Environment-specific WIF provider resource name. |
| `GCP_SERVICE_ACCOUNT` | Environment | Environment-specific deployer or infrastructure service account. |

Keep Supabase runtime keys in GCP Secret Manager, not GitHub. Keep notification recipient addresses inside GCP notification channels, not OpenTofu state or GitHub variables.

### Infrastructure Workflow Variables

| Variable | Description |
| --- | --- |
| `TF_STATE_BUCKET` | Remote GCS state bucket. |
| `TF_STATE_PREFIX` | Remote GCS state prefix. |
| `INITIAL_IMAGE` | Immutable GAR digest used for bootstrap/import reconciliation. |
| `STAGING_SUPABASE_URL` | Staging Supabase URL. |
| `STAGING_SUPABASE_SECRET_VERSION` | Tested numeric staging secret version. |
| `PRODUCTION_SUPABASE_URL` | Production Supabase URL. |
| `PRODUCTION_SUPABASE_SECRET_VERSION` | Tested numeric production secret version. |

## Available Commands

| Command | Description |
| --- | --- |
| `bun install` | Install dependencies using the pinned Bun lockfile. |
| `bun run dev` | Start Qwik City development server on port `5173`. |
| `bun run build` | Run the production Qwik build. |
| `bun run build.types` | Run TypeScript with `--noEmit`. |
| `bun run test` | Run Vitest tests once. |
| `bun run test.watch` | Run Vitest in watch mode. |
| `bun run test.e2e` | Run Playwright tests. |
| `bun run verify` | Run Biome, type checking, unit tests, and production build. |
| `bun run biome` | Run Biome checks with fixes. |
| `bun run qwik-speak-extract` | Extract inline translation keys into all locale assets. |
| `bun run docker.build` | Build local Docker image `aestheticlab:local`. |
| `bun run docker.build.ci` | Build Linux AMD64 Docker image `aestheticlab:ci`. |
| `bun run serve` | Run built Bun server from `server/entry.bun.js`. |
| `make help` | Show Makefile targets. |
| `make dev` | Wrapper for `bun run dev`. |
| `make build` | Wrapper for `bun run build`. |
| `make lint` | Wrapper for `bun run biome`. |
| `make clean` | Remove build artifacts and `node_modules`, then reinstall. |

## Architecture

### Directory Structure

```text
.
|-- .github/
|   |-- workflows/
|   |   |-- deploy.yml          # Build, stage, release, and promote to Cloud Run
|   |   |-- infrastructure.yml  # Protected OpenTofu plan/apply workflow
|   |   `-- quality.yml         # PR and staging quality/security gates
|   |-- COMPONENT_GUIDE.md      # UI composition rules
|   |-- DATA_LOADING.md         # Supabase loader patterns
|   |-- DEPLOYMENT.md           # Delivery and Cloud Run operations
|   `-- I18N_GUIDE.md           # Qwik Speak conventions
|-- adapters/
|   |-- bun/                    # Qwik adapter config for Bun server output
|   `-- static/                 # Static adapter config
|-- e2e/                        # Playwright specs
|-- i18n/                       # Qwik Speak locale JSON assets
|-- infra/                      # OpenTofu-managed GCP infrastructure
|-- public/                     # Static public files
|-- scripts/
|   `-- smoke-deployment.sh     # Deployment smoke test used by CI/CD
|-- src/
|   |-- components/
|   |   |-- router-head/        # Document head rendering
|   |   |-- sections/           # Page sections
|   |   `-- ui/                 # Reusable UI primitives
|   |-- constants/              # Navigation and metadata constants
|   |-- media/                  # Source media imported by Qwik/Vite
|   |-- routes/                 # Qwik City routes and route loaders
|   |-- shared/                 # Runtime config, Supabase, security, locale utilities
|   |-- entry.bun.ts            # Bun production server entry
|   |-- entry.dev.tsx           # Development entry
|   |-- entry.preview.tsx       # Preview entry
|   |-- entry.ssr.tsx           # SSR renderer
|   |-- global.css              # Tailwind CSS 4 and DaisyUI setup
|   `-- speak-config.ts         # Supported locales and Qwik Speak config
|-- Dockerfile                  # Pinned multi-stage Bun runtime image
|-- Makefile                    # Local and manual deployment helper targets
|-- package.json                # Scripts, versions, dependency policy
`-- vite.config.ts              # Qwik, Qwik City, Tailwind, Qwik Speak, Vitest config
```

Generated `dist/` and `server/` output comes from `bun run build`; do not edit it by hand.

### Request Lifecycle

```text
Browser
  -> Bun.serve in src/entry.bun.ts
  -> health/readiness route or Qwik City middleware
  -> src/routes/plugin.ts sets Qwik Speak locale
  -> src/routes/[...lang]/layout.tsx runs shared routeLoader$ data loaders
  -> page route renders Qwik components
  -> security headers, cache headers, optional gzip
  -> response
```

### Public Routes

| Route | Purpose |
| --- | --- |
| `/` | Redirects or resolves through the default locale behavior. |
| `/:lang/` | Localized home page. Example: `/en-BE/`. |
| `/:lang/pricelist/` | Localized price list page. Example: `/fr-BE/pricelist/`. |
| `/healthz` | Process health. Does not validate Supabase. |
| `/readyz` | Runtime configuration readiness. Requires valid Supabase URL/key shape. |
| `/dependencyz` | Supabase dependency readiness. Queries `gettimely.contacts` for `id=1`. |

### Component Model

- Route files own page composition and `DocumentHead`.
- Section components in `src/components/sections/` render full page bands such as hero, services, team, gallery, about, reviews, contact, and footer.
- UI primitives in `src/components/ui/` render reusable widgets such as booking modal, language switcher, service cards, cookie banner, map, and animation wrappers.
- Use Qwik APIs only: `component$`, signals/stores, `$()` handlers, `routeLoader$`, and Qwik City helpers.
- Use `~/*` imports and typed props.
- Prefer DaisyUI semantic tokens and existing classes over ad hoc styling.

### Runtime Server Behavior

`src/entry.bun.ts` is the production server entry:

- Serves `/healthz`, `/readyz`, and `/dependencyz`.
- Corrects forwarded HTTPS requests behind Cloud Run.
- Applies security headers from `src/shared/security-headers.ts`.
- Adds immutable caching for hashed build assets and long-lived caching for media/fonts.
- Applies gzip compression when the request supports it and the response is compressible.
- Runs on `PORT` or `3000`.

## Data Loading

All Supabase data fetching belongs in `src/routes/[...lang]/layout.tsx`.

```text
routeLoader$
  -> supabase(event)
  -> createServerClient(SUPABASE_URL, SUPABASE_KEY)
  -> schema("gettimely")
  -> typed safe default
  -> locale mapping
  -> page component props
```

Existing loaders:

| Loader | Supabase table | Return type | Safe default |
| --- | --- | --- | --- |
| `useContactLoader` | `gettimely.contacts` | `Contact \| null` | `null` |
| `useServiceGroupsLoader` | `gettimely.service_groups` | `ServiceGroup[]` | `[]` |
| `useTechniciansLoader` | `gettimely.staff` | `Staff[]` | `[]` |
| `useServicesLoader` | `gettimely.services` | `Service[]` | `[]` |

Rules:

- Use the per-request Supabase client from `src/shared/supabase-client.ts`.
- Access env vars with `event.env.get("SUPABASE_URL")` and `event.env.get("SUPABASE_KEY")`.
- Never query Supabase directly from UI components or browser code.
- Never throw from route loaders for normal data failures; log and return safe defaults.
- Locale-specific database fields are mapped in loaders, not components.
- Keep Supabase keys least-privilege; runtime readiness rejects privileged key families.

## Internationalization

Supported locales are configured in `src/speak-config.ts`:

| Locale | Language | Notes |
| --- | --- | --- |
| `en-BE` | English | Default |
| `nl-BE` | Dutch | Belgium |
| `fr-BE` | French | Belgium |
| `ru-BE` | Russian | Belgium |
| `uk-BE` | Ukrainian | Belgium |

Translation files live in `i18n/<locale>/app.json` and `i18n/<locale>/runtime.json`.

Use `inlineTranslate()` in Qwik components:

```tsx
import { inlineTranslate } from "qwik-speak";

const t = inlineTranslate();

<span>{t("app.nav.services@@Services")}</span>;
```

Rules:

- Every translation call must include `@@Default English Text`.
- Run `bun run qwik-speak-extract` after adding or changing translation keys.
- Keep all five locale assets synchronized.
- Do not translate inside route loaders or plain utility modules.
- Add new locales in `src/speak-config.ts`, `vite.config.ts`, the extraction script, and `i18n/`.

## Testing and Verification

### Unit and Type Checks

```bash
bun run build.types
bun run test
```

Vitest picks up `src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}` and runs in a Node environment.

### E2E Tests

```bash
bun run test.e2e
```

Playwright starts `bun run dev` at [http://localhost:5173](http://localhost:5173). Specs live in `e2e/`.

### Full Verification

```bash
bun run verify
```

This is required for app, build, dependency, and deployment-affecting changes.

### File-Scoped Checks

| Change | Command |
| --- | --- |
| Source file | `bunx --bun biome check --write path/to/file` |
| Unit test file | `bunx vitest run path/to/file.test.ts` |
| E2E spec | `bunx playwright test path/to/file.spec.ts` |
| Markdown | `markdownlint --disable MD013 -- path/to/file.md` |
| Translation keys | `bun run qwik-speak-extract` plus affected locale review |
| Infrastructure | `tofu -chdir=infra fmt -check -recursive`, `tofu -chdir=infra init -backend=false`, `tofu -chdir=infra validate` |

## Local Docker Runtime

Build and run the production container locally:

```bash
bun run docker.build
docker run --rm --publish 3000:3000 \
  --env SUPABASE_URL \
  --env SUPABASE_KEY \
  aestheticlab:local
```

Check runtime endpoints:

```bash
curl --fail http://localhost:3000/healthz
curl --fail http://localhost:3000/readyz
curl --fail http://localhost:3000/dependencyz
```

For CI-like smoke tests without a real Supabase dependency:

```bash
SMOKE_SKIP_DEPENDENCY=true ./scripts/smoke-deployment.sh http://localhost:3000
```

The Dockerfile:

- Builds with pinned `oven/bun:1.3.14`.
- Installs production dependencies separately.
- Runs a distroless Bun runtime as non-root user `65532:65532`.
- Copies only `node_modules`, `dist`, `public`, and `server` into runtime.
- Exposes port `3000`.

## Deployment

GitHub Actions is the delivery system. Do not deploy production manually unless recovering from an incident with an explicit rollback plan.

### Delivery Flow

```text
staging push
  -> quality.yml
  -> build production image once
  -> generate SBOM and provenance attestation
  -> scan exact digest
  -> deploy no-traffic staging candidate
  -> smoke-test tagged staging URL
  -> promote staging to 100%
  -> tag digest as verified-<commit-sha>

published GitHub release
  -> validate release tag equals package.json version
  -> resolve verified-<commit-sha> digest
  -> verify provenance
  -> re-scan exact digest
  -> deploy no-traffic production candidate
  -> persist rollback state
  -> protected production approval
  -> smoke-test candidate URL
  -> shift 10% candidate / 90% previous
  -> smoke-test candidate URL during split
  -> shift 100% candidate
  -> smoke-test canonical production URL
  -> independent watchdog verifies final traffic state
```

The latest production release is `v2.8.1`. That release includes the production canary smoke-test fix: canary validation targets the tagged candidate URL while traffic is split, then validates the canonical production URL after 100% promotion.

### Release Checklist

1. Merge changes to `staging` through a PR.
2. Wait for the staging deploy workflow to finish successfully.
3. Ensure `package.json` contains the intended semantic version.
4. Create an annotated tag on the exact verified `staging` commit.
5. Push the tag.
6. Publish a GitHub release from that tag.
7. Approve the protected production environment after reviewing the run metadata.
8. Confirm `production_prepare`, `production`, and `production-watchdog` finish successfully.
9. Confirm `/readyz` and user-facing localized smoke paths are healthy.

Example:

```bash
git checkout staging
git pull --ff-only origin staging
git tag -a v2.8.1 -m "v2.8.1"
git push origin v2.8.1
gh release create v2.8.1 --verify-tag --title "v2.8.1" --generate-notes
gh run watch --repo lieranderl/qwik-aestheticlab --exit-status
```

Do not reuse or move release tags. If a release is wrong, publish a new patch version.

### Smoke Test Contract

`scripts/smoke-deployment.sh` verifies:

- `/readyz`
- `/dependencyz` unless `SMOKE_SKIP_DEPENDENCY=true`
- `/en-BE/` contains `Aesthetic Lab`
- `/fr-BE/pricelist/` contains `Aesthetic Lab`
- localized pages return `X-Content-Type-Options: nosniff`

### Rollback

The production workflow automatically rolls traffic back to the previous revision if promotion fails or is interrupted before completion. For an explicit manual rollback:

```bash
gcloud run revisions list \
  --service "$PROD_SERVICE" \
  --region "$GCP_REGION" \
  --project "$GCP_PROJECT"

gcloud run services update-traffic "$PROD_SERVICE" \
  --region "$GCP_REGION" \
  --project "$GCP_PROJECT" \
  --to-revisions "$PREVIOUS_REVISION=100"
```

Record the incident and reconcile desired state through the normal workflow. Do not create console-only drift.

## Infrastructure

OpenTofu in `infra/` owns:

- Artifact Registry repository.
- Staging and production Cloud Run services.
- Dedicated runtime service accounts.
- Dedicated GitHub WIF providers and deployer service accounts.
- Secret Manager secret containers and secret-level IAM bindings.
- Uptime checks and alert policies.
- Infrastructure plan/apply identities.

Local validation:

```bash
tofu -chdir=infra fmt -check -recursive
tofu -chdir=infra init -backend=false
tofu -chdir=infra validate
```

Protected infrastructure changes use `.github/workflows/infrastructure.yml`:

1. Run the workflow from `staging`.
2. The `infrastructure-plan` environment creates a saved plan with a read-only planning identity.
3. Review the plan summary and artifact.
4. Re-run with `apply=true` only when the protected `infrastructure` environment should apply that exact saved plan.

After bootstrap, do not apply OpenTofu locally to shared environments.

## Operations

### Health Endpoints

| Endpoint | Meaning | Typical use |
| --- | --- | --- |
| `/healthz` | Bun process responds. | Liveness/process check. |
| `/readyz` | Runtime configuration is valid. | Readiness and deployment smoke. |
| `/dependencyz` | Supabase dependency responds with expected data. | Startup/dependency validation. |

### Caching

- Localized HTML is fresh for 300 seconds and can serve stale while revalidating for seven days.
- Hashed Qwik build assets and Vite assets are immutable for one year.
- Fonts are cached for 30 days with stale-while-revalidate.
- Other static media is cached for seven days with a 30-day stale window.
- Translation changes require a rebuild because Qwik Speak inlines translations at build time.

### Security Headers

`src/shared/security-headers.ts` applies:

- Content Security Policy.
- Permissions Policy.
- Referrer Policy.
- Strict Transport Security.
- `X-Content-Type-Options: nosniff`.
- `X-Frame-Options: SAMEORIGIN`.

Update smoke tests and CSP together when adding external embeds or analytics targets.

### Monitoring

OpenTofu-managed monitoring covers localized pages, Supabase dependency readiness, availability, 5xx rate, p95 latency, instance saturation, memory pressure, loader failures, and unexpected production mutation signals.

## Troubleshooting

| Symptom | Likely cause | Check or fix |
| --- | --- | --- |
| `bun run dev` starts but data is empty | Missing or rejected Supabase config | Check `.env`, `SUPABASE_URL`, and publishable/anon `SUPABASE_KEY`. |
| `/readyz` returns `503` | Runtime env is incomplete or uses a privileged key | Use `sb_publishable_*` or anon JWT, never `service_role` or `sb_secret_*`. |
| `/dependencyz` returns `503` | Supabase request failed or expected `contacts.id=1` is unavailable | Check Secret Manager version, Supabase RLS, `gettimely.contacts`, and Cloud Run logs. |
| Release fails resolving image | Release tag commit was not successfully deployed to staging | Merge to `staging`, wait for verified digest, then publish a new release tag. |
| Release fails immediately on version guard | Tag does not match `v$(package.json.version)` | Bump `package.json`, merge, tag the exact commit, publish a new release. |
| Canary smoke fails during production split | Candidate URL or dependency failed | Inspect the tagged candidate URL and logs; canonical URL is only authoritative after 100% promotion. |
| Production workflow rolls back | Promotion failed or was interrupted | Review `production` and `production-watchdog` logs; previous revision should have 100% traffic. |
| Biome changes many files | `bun run biome` fixes formatting | For targeted edits use `bunx --bun biome check --write path/to/file`. |
| Translation key displays English fallback | Locale JSON missing or stale | Run `bun run qwik-speak-extract` and manually translate non-English values. |
| E2E tests fail on missing browser | Playwright browsers/deps missing | Run `bunx playwright install --with-deps chromium` or the needed browser. |
| OpenTofu wants to replace live services | Import/state/provider drift or wrong variables | Stop, inspect plan, import existing resources, and verify environment variables. |

## Contributing

- Read `AGENTS.md` before making changes.
- Use feature branches and PRs targeting `staging`.
- Keep changes scoped and follow existing Qwik, DaisyUI, Supabase, and i18n patterns.
- Run the narrowest useful verification before opening a PR; run `bun run verify` for app, build, dependency, or deployment changes.
- For new translation keys, run `bun run qwik-speak-extract` and update all locale files.
- For docs-only changes, run `markdownlint --disable MD013 -- README.md`.
- Do not commit secrets, service-role keys, `.env`, local state, generated build output, or Cloud Run console-only changes.
- Do not commit, push, create PRs, deploy, or alter cloud resources unless explicitly requested.

## License

MIT. See [LICENSE](LICENSE).
