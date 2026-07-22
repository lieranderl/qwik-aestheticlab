# Decouple Container Health from Supabase

## Goal

Keep Cloud Run container health independent of Supabase availability while retaining explicit external dependency monitoring.

## Scope

- Point the Cloud Run startup probe at `/healthz`.
- Keep `/dependencyz` for deployment smoke tests and external uptime monitoring.
- Align deployment documentation with the probe behavior.

## Non-Goals

- Change the application endpoint implementations.
- Change Supabase monitoring frequency or alerting.
- Deploy to production.

## Assumptions

- `/healthz` remains a process-only check.
- `/dependencyz` remains the bounded Supabase dependency check.

## Phases

1. Update the Cloud Run startup probe and deployment documentation.
2. Run OpenTofu format/validation, Markdown lint, and repository verification.
3. Commit on a feature branch, open a pull request to `staging`, wait for checks, and squash-merge.
4. Monitor the staging deployment to completion.

## Phase-Wise Gating

- Phase 1: Review the diff to confirm `/dependencyz` is no longer referenced by a container probe.
- Phase 2: All required validation commands pass.
- Phase 3: All pull-request checks pass before merge.
- Phase 4: The staging deployment workflow and smoke tests pass.

## Commit Strategy

- One focused commit covering the probe, documentation, and this execution plan.

## Verification

- `tofu -chdir=infra fmt -check -recursive`
- `tofu -chdir=infra init -backend=false -input=false`
- `tofu -chdir=infra validate`
- `markdownlint --disable MD013 -- .github/DEPLOYMENT.md plans/decouple-container-health-from-supabase.md`
- `bunx --bun biome ci .`
- `bun run verify`
