# Production Release v2.8.5

## Goal

Promote the latest verified `staging` commit to production as `v2.8.5`.

## Scope

- Bump the package version only; do not change application behavior.
- Merge the release change through a pull request targeting `staging`.
- Publish an annotated tag and GitHub release for the verified merge commit.
- Monitor the production workflow through smoke tests and traffic promotion.

## Assumptions

- The pre-release `staging` deployment for commit `28f782ef98fc1d93e383f4c9dec1597e984dc357` succeeded.
- GitHub Actions resolves and promotes the immutable image digest produced for the release commit.
- The protected `production` environment is configured for required approval.

## Phases and Gates

1. Set the package version to `2.8.5`.
   - Gate: `bun run verify` succeeds.
2. Commit, push, and merge the release pull request into `staging`.
   - Gate: all required PR checks pass.
3. Confirm the merged `staging` commit completes its staging deployment.
   - Gate: the deployment workflow succeeds for the exact merge commit.
4. Create and push annotated tag `v2.8.5`, then publish the GitHub release.
   - Gate: the production workflow starts for the exact tagged commit.
5. Monitor production promotion.
   - Gate: production smoke tests, canary, and final traffic promotion succeed.

## Commit Strategy

Use one release commit containing the version bump and this execution plan.

## Verification

- `bun run verify`
- Required GitHub pull request checks
- Successful staging deployment workflow for the release commit
- Successful production deployment workflow for `v2.8.5`
