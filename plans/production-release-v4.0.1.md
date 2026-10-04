# Production Release v4.0.1

## Goal and Scope

Fix broken optimized image URLs and complete the authorized production rollout.
Preserve the published v4.0.0 tag; release the correction as v4.0.1.

## Root Cause and Evidence

- Gallery sources lazer1.jpg and universal.jpg have identical bytes.
- Independent client and SSR builds deduplicate these names differently.
- v3.0.4 renders lazer1 URLs but serves universal URLs; v4.0.0 does the reverse.
- Direct requests reproduce 404s on each revision's own rendered image URLs.
- The v4.0.0 canary counted 34 image 404s and correctly rolled traffic back.
  Production remained healthy on v3.0.4 with 100% traffic after rollback.
- Enhanced smoke tests fail against v4.0.0 on the missing rendered images.

## Implementation

1. Import universal.jpg as the canonical image; resolve the existing lazer1
   gallery key to that same component and exclude its duplicate source import.
2. Serve cached lazer1 image URLs through the corresponding universal asset only
   when the identical content hash exists; preserve method, query, and origin.
3. Probe every optimized image variant in deployment smoke-test HTML and require
   an image response. Before traffic splitting, identify pre-existing lazer1
   image defects only when the candidate repairs them with byte-identical data
   already served by the old revision at its canonical URL. Exclude only those
   proven defects from mixed-traffic smoke tests and cross-revision counting;
   candidate and final smoke tests verify every image without exclusions.
   Keep gates and thresholds.
   Preserve the Cloud Run affinity cookie across page and asset probes; verify
   this behavior with a server that rejects image requests without the cookie.
4. Bump package.json to 4.0.1 and document the deployment invariant.

## Phases and Verification Gates

1. Verify unit tests, coverage, types, lint, build, and Markdown.
2. Run enhanced smoke tests on the built Bun server and legacy image URLs.
   Run the relevant home-page Playwright spec.
3. Commit the correction on a feature branch with AI co-author attribution.
   Push, open a PR targeting staging, and merge only after all checks pass.
4. Require staging deployment of the exact merge commit to succeed.
5. Tag that commit as v4.0.1 and publish the release with generated notes.
6. Approve production under the existing authorization; require candidate smoke
   tests, 300-second canary, error gates, full promotion, and watchdog success.
7. Confirm 100% production traffic and run enhanced production smoke tests.

## Assumptions and Constraints

- User authorized fixing the compatibility issue and retrying production.
- Do not move release tags, weaken deployment gates, or modify unrelated files.
- Production reuses the verified staging image digest without rebuilding.
- No infrastructure or dependency changes are needed.
