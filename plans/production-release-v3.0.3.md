# Production Release v3.0.3 Plan

## Goal

Ship the application changes from v3.0.2 to production. The v3.0.2 release (run 37032473002) rolled back during its canary.

## Why a New Release

- The v3.0.2 canary rolled back on one 503 from the candidate revision at 16:21:39 UTC. The request could not be reproduced on staging, which runs the same build.
- During the 90/10 split, Cloud Run routed requests per request, so pages from one revision requested hashed assets from the other and got 404s.
- #213 and #214 fixed the infrastructure and added session affinity plus a cross-revision asset 404 gate. Infrastructure run 37035169307 applied them: both services now use the `/healthz` startup probe and session affinity.
- GitHub re-runs use the workflow file from the original commit, so re-running the v3.0.2 run would skip these changes. v3.0.3 tags a commit that contains them.

## Changes Since v3.0.2

- #213: Stop pinning Cloud Run revision names in OpenTofu.
- #214: Session affinity and cross-revision asset 404 canary gate.
- This release: `CANARY_BAKE_SECONDS` temporarily set to 60. The live v3.0.1 revision has no session affinity, so its visitors can still be routed to the candidate during the split; a shorter bake limits that window. Restore 300 in a follow-up change after v3.0.3 is live.

## Assumptions

- The production deployer holds `roles/logging.viewer`.
- Infrastructure run 37035169307 succeeded; production revision `aestheticlab-web-00068-tk7` (no traffic) carries session affinity and the `/healthz` probe, so the candidate deploy copies both.
- Production traffic is 100% on `aestheticlab-web-candidate-33270983429-1` (v3.0.1).

## Constraints

- Do not move or reuse the `v3.0.0`, `v3.0.1`, or `v3.0.2` tags.
- Tag `v3.0.3` at the exact staging merge SHA after its staging deployment tags `verified-<sha>`.
- Production reuses the staging-verified digest and does not rebuild.

## Phases

1. Merge this PR to `staging` after all checks pass; confirm the staging deployment for the merge SHA succeeds.
2. Create annotated tag `v3.0.3` at that SHA, push only the tag, and run `gh release create v3.0.3 --verify-tag --title "v3.0.3" --generate-notes`.
3. Approve `production`. Require candidate smoke test, 10/90 canary, 60-second bake, clean 5xx and cross-revision asset 404 gates, canonical-domain smoke test, 100% promotion, and watchdog success.
4. Confirm 100% traffic on the new candidate revision and run `./scripts/smoke-deployment.sh https://aestheticlab.be`.
5. Open a follow-up change restoring `CANARY_BAKE_SECONDS` to 300.

## Verification

- `bun run verify`
- Required pull-request checks
- Staging deployment workflow for the merge SHA
- Production deployment workflow for release `v3.0.3`
- `./scripts/smoke-deployment.sh https://aestheticlab.be`
