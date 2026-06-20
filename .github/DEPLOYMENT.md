# Deployment Guide

## Delivery Model

```text
staging commit → verify → build/scan/attest once → Artifact Registry digest
               → staging no-traffic deploy → smoke test → staging traffic
GitHub release → resolve the verified digest for the release commit
               → production approval + independent watchdog
               → no-traffic deploy → smoke test → 10% canary
               → canonical-domain check → 100% or automatic rollback
```

- GitHub Actions is the only automated delivery system; workflow definitions live in `.github/workflows/`.
- GCP authentication uses GitHub OIDC and Workload Identity Federation; no service-account keys are stored in GitHub.
- Container tags are lookup metadata. Scan success creates `verified-<full-commit-sha>`; Cloud Run deployments always use the immutable `sha256` digest.
- Production promotion never rebuilds. A published release must reference the exact commit already verified and deployed to staging; a separate runner reconciles an abandoned 10/90 canary.
- The protected `production` GitHub environment owns approval and environment-scoped configuration.

Repository/environment configuration:

| Scope | Variables |
| --- | --- |
| Repository | `GCP_PROJECT`, `GCP_REGION`, `GAR_REPOSITORY`, `IMAGE_NAME`, `STAGE_SERVICE`, `PROD_SERVICE`, `PROD_URL` |
| Each environment | `GCP_WORKLOAD_ID_PROVIDER`, `GCP_SERVICE_ACCOUNT` |

Store configuration at the narrowest applicable scope. WIF resource names and service-account emails are identifiers, not secrets; no private key is stored in GitHub.

## Container

- `Dockerfile` performs the Qwik build and creates a minimal Bun runtime image.
- The distroless runtime contains built `dist/`, `public/`, and `server/` output plus the minimal production dependency graph; build-only dependencies remain in the build stage.
- The runtime is non-root, exposes port `3000`, and starts `server/entry.bun.js`.
- PR CI builds, runs, and scans the production container. Delivery generates an SBOM and provenance attestation, scans the exact published digest, and gates deployment on the result; production verifies provenance and re-scans before deployment.
- Images are stored in the regional Google Artifact Registry repository managed by OpenTofu.

Local verification:

```bash
bun run verify
docker build --tag aestheticlab:local .
docker run --rm --publish 3000:3000 \
  --env SUPABASE_URL \
  --env SUPABASE_KEY \
  aestheticlab:local
curl --fail http://localhost:3000/healthz
```

## Quality Gates

- `.github/workflows/quality.yml` runs on every pull request and `staging` push.
- It runs non-mutating Biome checks, type checking, unit tests, a production build, Chromium E2E smoke tests, a high-severity dependency audit, and full-history secret scanning.
- `.github/workflows/deploy.yml` pins third-party actions to commit SHAs and blocks deployment when Trivy finds a fixed high or critical image vulnerability.

## Cloud Run

- Staging and production are separate services with dedicated runtime service accounts and Secret Manager secrets. They currently share one read-only Supabase project protected by RLS.
- Runtime identities receive access only to the named Secret Manager secret, never project-wide secret roles.
- Deployments create a revision with no traffic, validate the Supabase dependency and localized pages through a temporary tagged URL, remove the tag after validation, then migrate traffic; Cloud Run startup and liveness probes validate `/dependencyz` and `/healthz` internally.
- Startup/liveness probes, scaling, concurrency, resource limits, labels, and environment variables are declared in `infra/`.
- Production supports multiple instances; tune concurrency and memory from monitoring data, not by console drift.

Required runtime configuration:

| Name | Source | Notes |
| --- | --- | --- |
| `SUPABASE_URL` | Cloud Run environment | Public project URL |
| `SUPABASE_KEY` | Environment-specific Secret Manager secret | Publishable/anon key injected at runtime; `service_role` and `sb_secret_*` keys fail readiness |
| `NODE_ENV` | Container | `production` |

## Infrastructure as Code

- `infra/` is canonical for Artifact Registry, Cloud Run, IAM, Workload Identity Federation, secrets access, uptime checks, and alerts.
- Use a remote, versioned, encrypted state backend with locking; do not use local state for production resources.
- Pin OpenTofu and provider versions; commit `.terraform.lock.hcl`.
- Pull requests validate OpenTofu. Post-bootstrap plans and applies run only through `.github/workflows/infrastructure.yml`; a read-only planning identity creates the immutable plan, while the privileged identity is available only after protected `infrastructure` approval.
- Review plans for replacement, IAM expansion, public access, and secret exposure.
- Import existing resources before the first apply; never recreate production merely to bring it under management.

Typical local checks (follow `infra/README.md` for backend/environment inputs):

```bash
tofu -chdir=infra fmt -check -recursive
tofu -chdir=infra init -backend=false
tofu -chdir=infra validate
```

## Caching

The localized route shell is configured in `src/routes/[...lang]/layout.tsx`:

```tsx
cacheControl({
  staleWhileRevalidate: 60 * 60 * 24 * 7,
  maxAge: 60 * 5,
});
```

- Dynamic HTML is fresh for 300 seconds, then eligible for stale-while-revalidate for seven days.
- Hashed Vite assets use long-lived immutable caching.
- Translation changes require a rebuild because Qwik Speak inlines translations.

## Release

1. Merge a verified change to `staging` and confirm the staging deployment and smoke test passed.
2. Set `package.json` to the release version in the release change and run `bun run verify`.
3. Create an annotated semantic-version tag for that exact commit and push it.
4. Publish the GitHub release from the tag; the release-published workflow resolves the existing digest.
5. Approve the protected production environment after reviewing artifact identity and deployment metadata.
6. Confirm production smoke tests, traffic migration, uptime, errors, latency, and revision health.

Use `gh release create v<x.y.z> --verify-tag --title "v<x.y.z>" --generate-notes` after the tag is available remotely.

## Rollback

Prefer an immediate traffic rollback; it does not rebuild or mutate the failed revision:

```bash
gcloud run revisions list --service SERVICE --region REGION
gcloud run services update-traffic SERVICE \
  --region REGION \
  --to-revisions PREVIOUS_REVISION=100
```

- Record the incident and reconcile the desired image digest in OpenTofu/delivery configuration.
- Do not overwrite or reuse release tags.

## Operational Checks

- OpenTofu manages content-matched page/dependency uptime checks plus availability, 5xx, p95 latency, instance-saturation, memory-limit, structured Supabase-failure, and unexpected-production-mutation alerts.
- Candidate deployment smoke tests require readiness, localized content, and security headers on `/en-BE/` and `/fr-BE/pricelist/` before traffic migration.
- Inspect Cloud Run revision logs and monitoring before shifting traffic.
- Treat a passing `/healthz` as process health only; localized smoke tests validate the dependency path.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Release cannot resolve an image | Tag commit must match a successful staging artifact/deployment record |
| New revision fails before traffic | Container logs, probes, secret access, runtime service-account IAM |
| Supabase data missing | Environment URL, secret version binding, loader error logs |
| Stale content after update | Dynamic response may remain fresh for 300 seconds |
| IaC proposes unexpected replacement | Provider/version drift, imported resource identity, environment state selection |
