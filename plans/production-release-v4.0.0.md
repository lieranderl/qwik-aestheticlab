# Production Release v4.0.0

## Goal

Release the current staging application as v4.0.0 to production.

## Scope

- Bump package.json from 3.0.4 to 4.0.0; no application changes.
- Includes the Sage & Linen redesign, hero refresh, booking CTAs, scrolling,
  local SEO titles, video updates, and mobile footer fix merged since v3.0.4.
- Preserve existing user files, including the untracked .claude directory.

## Assumptions

- User authorized the version bump, staging merge, and production release.
- Production must reuse the verified digest for the exact staging merge commit.
- Existing release tags must not be moved or reused.

## Phases and Gates

1. Verify the version bump with bun run verify and Markdown lint.
2. Commit and push a release branch; create a PR targeting staging.
   Require all PR checks before squash merge.
3. Wait for the staging deployment of the merge commit to succeed.
4. Create and push an annotated v4.0.0 tag at that exact commit, then publish
   the GitHub release with --verify-tag and generated notes.
5. Approve production under the user's deployment authorization. Monitor
   candidate smoke tests, 10% canary, 300-second bake, error gates,
   canonical-domain checks, full promotion, and watchdog reconciliation.
6. Confirm the workflow succeeds and smoke-test the production URL.

## Commit Strategy

One release preparation commit with the acting AI's co-author attribution.
Squash merge the PR and delete its remote branch after checks pass.

## Verification

- bun run verify
- bunx --bun biome ci .
- markdownlint --disable MD013 -- plans/production-release-v4.0.0.md
- Required PR checks and successful staging workflow for the merge commit
- Successful production workflow for v4.0.0
- `scripts/smoke-deployment.sh https://aestheticlab.be`
