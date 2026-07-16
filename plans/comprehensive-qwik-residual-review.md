# Comprehensive Qwik Residual Review

## Goal

Close the confirmed production gaps left after the July 2026 Qwik modernization
while preserving business behavior, visual intent, localization, accessibility,
SEO, and the current deployment model.

## Scope

- Correct duplicate analytics initialization and invalid localized route handling.
- Narrow and validate Supabase data before it crosses Qwik loader boundaries.
- Remove duplicate raw image emission and improve responsive image selection.
- Correct confirmed contrast and progressive-enhancement regressions.
- Align compatible stable dependency updates and document blocked major upgrades.
- Add focused tests for every changed critical boundary.

## Non-goals

- No visual redesign, Supabase schema change, Cloud CDN introduction, deployment,
  commit, push, or pull request.
- No loader relocation that conflicts with the repository rule keeping shared
  localized data in `src/routes/[...lang]/layout.tsx`.
- No Vite 8 upgrade while Qwik 1.20 declares `vite >=5 <8`.
- No speculative component splitting, new state library, or validation package.

## Assumptions

- Commit `53802de` is the accepted modernization baseline and must not be churned.
- The Supabase schema may return malformed or nullable runtime data despite the
  compile-time interfaces, so public loader values require explicit projection.
- `https://aestheticlab.be` is the canonical public origin already used by the
  structured metadata.
- TypeScript 7 is evaluated as an isolated major upgrade and retained only if the
  full Qwik build and test matrix remains compatible.

## Baseline

- `bun ci`: passed; 302 installs across 385 packages, no changes.
- `bunx --bun biome ci .`: passed, 62 files.
- `bun run build.types`: passed.
- `bun run test`: passed, 37 tests in 7 files.
- `bun run build`: passed; emitted large duplicate gallery originals.
- `bun run test.e2e`: passed, 51 tests across Chromium, Firefox, and WebKit.
- `bun audit`: no vulnerabilities.
- Existing code failures: none. The first E2E attempt was blocked only by sandbox
  port permissions and passed unchanged when the local Vite server was allowed.

## Confirmed Findings

### Critical correctness issues

- No P0/P1 runtime outage was found.
- Analytics bootstrap and document-ready initialization enqueue duplicate initial
  `config` commands.
- The catch-all locale route silently renders unsupported/multi-segment paths as
  English 200 responses.

### Qwik architectural issues

- Supabase rows are spread into loader results, retaining raw locale variants and
  unrelated columns across the serialization boundary.
- `FadeUp` produces hidden SSR content until its client task runs.

### Performance problems

- Raw and optimized eager image globs emit the same source collection twice.
- Responsive images lack layout-specific `sizes`; below-fold service cards are
  unnecessarily eager/high priority.
- Shared layout loaders execute for descendants that do not consume all data.
  This is recorded as follow-up because moving them would conflict with current
  repository ownership guidance and needs a route-structure decision.

### TypeScript problems

- Supabase contracts are assertions without runtime guards at the external-data
  boundary.
- The injected readiness fetch type is wider than the implementation needs,
  forcing double assertions in tests.

### Dependency upgrades

- Align `@supabase/ssr` with an explicit compatible `@supabase/supabase-js` peer.
- Apply the latest Vitest patch.
- Evaluate TypeScript 7 with official migration notes and the full local matrix.
- Defer Vite 8 until a stable Qwik release supports it.

### Refactoring opportunities

- Use compact localized view models instead of raw database interfaces.
- Generate canonical and locale-alternate links from the production site origin.
- Remove stale suppressions and unused override entries only when proven safe.

### Testing gaps

- Analytics bootstrap plus initializer idempotence.
- Malformed/null Supabase row projection.
- Unsupported locale and nested-path status behavior.
- JavaScript-disabled content visibility and responsive image hints.

## Phases

1. Implement compact runtime-validated Supabase projections and unit tests.
2. Correct analytics idempotence, route rejection, canonical/alternate metadata,
   contrast, image delivery, and progressive enhancement.
3. Upgrade the compatible backend/testing dependencies; evaluate TypeScript 7.
4. Run file-scoped checks after each batch, then the complete validation matrix.

## Phase-wise Gating

- Phase 1: locale/data tests, typecheck, and route build pass.
- Phase 2: affected unit/E2E specs, Biome, typecheck, and production build pass.
- Phase 3: clean install, peer tree inspection, audit, unit tests, and build pass
  after each dependency group.
- Phase 4: `bun run verify`, all-browser Playwright, clean install, dependency
  audit/tree review, and build-output comparison pass.

## Commit Strategy

No commits are authorized. Leave the feature branch and verified working tree for
user review.

## Verification

- `bun ci`
- `bunx --bun biome ci .`
- `bun run build.types`
- `bun run test`
- `bun run build`
- `bun run verify`
- `bun run test.e2e`
- `bun audit`
- `bun outdated`
- Dependency peer/tree and build-asset inspection

## Outcome

- Supabase loaders now select explicit fields, validate untrusted rows, localize
  once, and serialize compact view models only.
- Unsupported locale/nested catch-all paths return 404; canonicals use the
  production origin and all five locales expose alternates plus `x-default`.
- Analytics initialization is idempotent, consent storage failure is non-fatal,
  hero contrast is corrected, and animated SSR content remains visible without
  JavaScript.
- Duplicate raw image emission was removed, responsive `sizes` were added, and
  below-fold service cards no longer request high-priority images.
- Updated `@supabase/ssr`, added its compatible explicit Supabase client peer,
  updated Vitest, and migrated to TypeScript 7 after the complete compatibility
  gate passed. Vite 8 remains deferred because Qwik 1.20 requires Vite below 8.
- Final gates passed: frozen install, Markdown lint, Biome CI, 42 unit tests,
  production client/SSR build, 60 deterministic Playwright tests, dependency
  audit, peer inspection, and build-asset inspection.

## Remaining Follow-up

- Shared layout loaders still execute for policy routes and load staff for the
  pricelist. Resolving this cleanly requires a route-group ownership decision
  because current repository guidance intentionally centralizes shared loaders.
- Cloud Run is exposed without a shared edge cache. Add Cloud CDN only if traffic
  and latency evidence justify the added infrastructure and cost.
- Add a CI asset budget if future image churn becomes recurrent; the current pass
  reduced assets from 169 files/10.1 MB to 143 files/4.2 MB.
