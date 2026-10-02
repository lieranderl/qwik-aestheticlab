# Production Release v3.0.2 Plan

## Goal

Promote the reliability, security, and delivery fixes already verified on staging to production as release `v3.0.2`.

## Changes Since v3.0.1

- #204: Patch vulnerable `sharp`, `svgo`, `undici`, and `valibot` overrides; unblocks the `bun audit` gate.
- #205: Bound Supabase queries to 3 seconds with retries disabled; shorten HTML caching to `max-age=60, stale-while-revalidate=600`.
- #206: Production canary bake (5 minutes) with a candidate-revision 5xx log gate that fails closed.
- #207: Consolidated dependency updates (bun 1.4.2 images, Supabase, Biome, Playwright, Vitest 5, DaisyUI).
- #209: Fix the unexpected-production-mutation alert for v1 `ReplaceService`; threshold-based 5xx and Supabase alerts; Artifact Registry cleanup in dry-run.
- #210: Qwik 1.20.1 with Rollup 4.62.5.
- #211: Pin CI runners to `ubuntu-24.04`; cache Playwright browsers with a bounded install.

## Scope and Non-goals

- In scope: the `3.0.2` manifest bump, protected staging PR and deployment, annotated release tag, GitHub release, and production promotion verification.
- Out of scope: further application, dependency, or infrastructure changes, and rebuilding a separate production image.

## Assumptions

- Infrastructure run 37028632895 created `google_project_iam_member.production_deployer_log_viewer`, granting the production deployer `roles/logging.viewer`, which the canary log gate requires.
- The same run failed to update both Cloud Run services (HTTP 409): `template[0].revision` is in `ignore_changes`, so OpenTofu re-sent the existing CI revision name with a changed template. The `/healthz` startup probe from #162 is therefore not live yet; it is tracked as a separate infrastructure fix and is not required for this release.
- GitHub environment approval is available for the protected `production` jobs.
- The canonical production URL remains `https://aestheticlab.be`.

## Global Constraints

- Never reuse or move the existing `v3.0.0` or `v3.0.1` tags.
- The release tag must equal `v$(jq -r .version package.json)` and point at the exact staging-verified merge commit.
- Production must reuse the staging-verified immutable digest and must not rebuild.
- Do not publish the release unless `roles/logging.viewer` is granted to the production deployer; without it the canary gate fails closed and rolls back.
- Do not expose runtime secrets or credentials in commands, plans, or logs.

## Phases

1. **Prepare:** change only the root `version` in `package.json` from `3.0.1` to `3.0.2` and add this plan. `bun.lock` does not store the root version.
2. **Staging:** open a pull request to `staging`, require all checks, squash-merge, and confirm the "Build and promote to Cloud Run" run for the merge SHA passes quality, build, scan, candidate smoke test, staging promotion, and `verified-<sha>` tagging.
3. **Infrastructure gate:** confirm the production deployer holds `roles/logging.viewer` (created by run 37028632895) and production traffic is unchanged on the v3.0.1 revision.
4. **Release:** create annotated tag `v3.0.2` at the exact staging merge SHA, push only that tag, then run `gh release create v3.0.2 --verify-tag --title "v3.0.2" --generate-notes`.
5. **Production:** approve the protected `production` environment and monitor `production_prepare`, `production`, and `production-watchdog`. Require provenance verification, digest re-scan, candidate smoke test, 10/90 canary, a clean 5-minute bake and 5xx log gate, canonical-domain smoke test, 100% promotion, and watchdog success.

## Phase-wise Gating

- Phase 1: `bun run verify`, `bun audit --audit-level=high`, and `markdownlint --disable MD013 -- plans/production-release-v3.0.2.md` pass.
- Phase 2: every required pull-request check and the staging deployment succeed.
- Phase 3: the infrastructure run log shows `google_project_iam_member.production_deployer_log_viewer: Creation complete`.
- Phase 4: the release tag's peeled commit equals the staging merge SHA.
- Phase 5: production traffic is 100% on the new candidate revision and `./scripts/smoke-deployment.sh https://aestheticlab.be` passes.

## Rollback

If the canary gate or any later step fails, the workflow restores 100% traffic to the previous revision automatically. For a manual rollback after promotion, follow the Rollback section of `.github/DEPLOYMENT.md`.

## Verification

- `bun run verify`
- `bun audit --audit-level=high`
- Required pull-request checks
- Staging deployment workflow for the exact merge SHA
- Production deployment workflow for release `v3.0.2`
- `./scripts/smoke-deployment.sh https://aestheticlab.be`
