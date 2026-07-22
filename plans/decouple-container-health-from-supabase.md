# Decouple Container Health from Supabase

## Goal

Keep Cloud Run container health independent of Supabase availability while retaining explicit external dependency monitoring.

## Scope

- Point the Cloud Run startup probe at `/healthz`.
- Keep `/dependencyz` for deployment smoke tests and external uptime monitoring.
- Align deployment documentation with the probe behavior.
- Remediate transitive high-severity advisories that block the required staging gate.

## Non-Goals

- Change the application endpoint implementations.
- Change Supabase monitoring frequency or alerting.
- Upgrade direct application dependencies.
- Deploy to production.

## Assumptions

- `/healthz` remains a process-only check.
- `/dependencyz` remains the bounded Supabase dependency check.
- Patched transitive overrides remain compatible when the full build and container checks pass.

## Phases

1. Update the Cloud Run startup probe and deployment documentation.
2. Run OpenTofu format/validation, Markdown lint, and repository verification.
3. Remediate any mandatory security gate failures with the smallest compatible dependency overrides.
4. Commit on a feature branch, open a pull request to `staging`, wait for checks, and squash-merge.
5. Run the protected saved-plan infrastructure workflow and monitor the staging application deployment.

## Phase-Wise Gating

- Phase 1: Review the diff to confirm `/dependencyz` is no longer referenced by a container probe.
- Phase 2: All required validation commands pass.
- Phase 3: `bun audit --audit-level=high`, the full build, and the production container checks pass.
- Phase 4: All pull-request checks pass before merge.
- Phase 5: The infrastructure apply and staging deployment workflow smoke tests pass.

## Commit Strategy

- One focused probe commit plus a follow-up commit for any mandatory CI gate remediation.

## Verification

- `tofu -chdir=infra fmt -check -recursive`
- `tofu -chdir=infra init -backend=false -input=false`
- `tofu -chdir=infra validate`
- `markdownlint --disable MD013 -- .github/DEPLOYMENT.md plans/decouple-container-health-from-supabase.md`
- `bunx --bun biome ci .`
- `bun audit --audit-level=high`
- `bun run verify`
