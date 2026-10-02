# Production Release v3.0.4 Plan

## Goal

Ship the changes merged to `staging` since v3.0.3 (`95de22d`) to production.

## Changes Since v3.0.3

- #216: Stabilize slow-runner WebKit E2E tests and upload Playwright reports on failure. Test and CI only.
- #217: Restore the 300-second production canary bake.
- #218: Fetch only the request locale's translation columns for services, service groups, and staff, which cuts the services payload from ~114 KB to 20–49 KB per render. Also: staff `photo_url` validation, the IPv6 loopback check fix, and removal of orphaned locale keys.
- This release: version bump to 3.0.4.

## Assumptions

- Production traffic is 100% on the v3.0.3 candidate revision, which has session affinity and the `/healthz` startup probe.
- Staging deployment run 37044596775 succeeded for `8ebd30c` (#218), which carries the same application code as this release.
- Supabase data changes made outside this repository on 2026-10-02 (Face Waxing group 738637 added to `gettimely`; the legacy `public` tables locked to API roles) are already live and do not depend on this release.

## Constraints

- Do not move or reuse the `v3.0.0` through `v3.0.3` tags.
- Tag `v3.0.4` at the exact staging merge SHA after its staging deployment tags `verified-<sha>`.
- Production reuses the staging-verified digest and does not rebuild.

## Phases

1. Merge this PR to `staging` after all checks pass; confirm the staging deployment for the merge SHA succeeds.
2. Run `gh release create v3.0.4 --target <merge-sha> --title "v3.0.4" --generate-notes`.
3. Approve `production`. Require candidate smoke test, 10/90 canary, 300-second bake, clean 5xx and cross-revision asset 404 gates, canonical-domain smoke test, 100% promotion, and watchdog success.
4. Confirm 100% traffic on the new candidate revision and run `./scripts/smoke-deployment.sh https://aestheticlab.be`.
5. Spot-check `/en-BE/pricelist/` and `/ru-BE/pricelist/` for localized service names, including Face Waxing.

## Verification

- `bun run verify`
- Required pull-request checks
- Staging deployment workflow for the merge SHA
- Production deployment workflow for release `v3.0.4`
- `./scripts/smoke-deployment.sh https://aestheticlab.be`
