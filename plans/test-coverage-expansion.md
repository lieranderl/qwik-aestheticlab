# Test Coverage Expansion

## Goal

Add meaningful automated test coverage to the highest-risk logic in the marketing site without introducing brittle tests or over-investing in low-value snapshots.

## Scope

- Replace placeholder or minimal tests with behavior-focused coverage
- Expand coverage for locale-aware navigation, service grouping, and consent behavior
- Add E2E checks for the main user journeys that matter on a marketing site
- Make future route-loader testing easier by extracting pure mapping logic where helpful

## Non-Goals

- No full visual regression suite in the first pass
- No exhaustive testing of every presentational section
- No major refactor of page structure just to satisfy tests

## Findings

- `src/components/ui/fade-up.spec.tsx` is currently a placeholder `Math.sqrt()` test, so it provides no real protection.
- `src/shared/locale-navigation.spec.ts` is the only meaningful unit test today, and it covers just a small slice of navigation behavior.
- `e2e/home.spec.ts` is a thin smoke test that only checks `/` redirects to a locale-prefixed URL and that the page body renders.
- `vite.config.ts` configures Vitest with `environment: "node"`, which makes browser-like component testing harder in the current setup.
- There is no obvious coverage reporter or browser-style unit test environment configured.
- High-value business logic already exists in pure or mostly-pure form:
  - `src/shared/service-utils.ts`
  - `src/shared/locale-navigation.ts`
  - `src/shared/cookie-consent.ts`
- High-risk untested route logic remains embedded in `src/routes/[...lang]/layout.tsx`, especially locale field mapping and safe fallback behavior.
- `src/components/sections/service-grid.tsx` contains several helper functions and state transitions that drive important browsing behavior.

## Assumptions

- The first testing pass should maximize confidence per hour, not aim for broad raw test counts.
- The team would prefer to avoid adding heavy test infrastructure unless the added value is clear.
- Route loaders should keep failing soft, so tests should confirm safe defaults instead of thrown errors.

## Phases

### Phase 1: Fix the current floor

1. Replace the placeholder `fade-up.spec.tsx` with either a real test or remove it until there is real behavior worth asserting.
2. Expand `src/shared/locale-navigation.spec.ts` to cover:
   - root locale preservation
   - nested routes
   - unknown locale fallback to `en-BE`
   - `#hash` and `/path` targets
3. Add a focused unit suite for `src/shared/service-utils.ts` covering:
   - grouping by `group_id`
   - price sorting within groups
   - category-priority sorting across groups
   - missing-category fallback behavior
   - special name mapping like `brows-lashes` and laser variants

### Phase 2: Cover consent and analytics behavior

1. Add unit tests for `src/shared/cookie-consent.ts` using mocked `window`, `document`, and `localStorage`.
2. Cover:
   - valid and invalid consent payload parsing
   - saved consent serialization
   - event param sanitization
   - page context generation
   - event suppression when consent is missing
   - consent update calls for enable/disable flows
3. Keep these tests at the helper level instead of trying to fully mount Qwik UI in the first pass.

### Phase 3: Make loader logic testable

1. Extract locale field resolution from `src/routes/[...lang]/layout.tsx` into a pure helper module.
2. Add unit tests for:
   - service-group localization across `en`, `ru`, `nl`, `fr`, `uk`
   - service name and description localization across locales
   - null or empty Supabase responses returning safe defaults
3. Leave Supabase query wiring inside the route file, but test the transformation logic separately.

### Phase 4: Expand E2E coverage for real user journeys

1. Grow `e2e/home.spec.ts` or split it into route-focused specs.
2. Add checks for:
   - `/` redirecting to `/${defaultLocale}/`
   - navigation links preserving the locale prefix
   - cookie banner first-visit behavior
   - accept/reject actions hiding the banner and enabling the settings trigger
   - mobile menu open/close behavior
   - `/${lang}/pricelist` rendering the main heading and core CTA shell
3. Keep E2E assertions semantic and user-visible, not style-fragile.

### Phase 5: Optional browser-style component testing

1. If Phase 1-4 still leaves important interaction gaps, add a browser-like unit environment such as `happy-dom` or `jsdom`.
2. Use it selectively for interactive UI pieces like:
   - `CookieBanner`
   - `ServiceCard`
   - `Navigation`
3. Do this only after the pure-helper and E2E layers are in place.

## Priority Order

1. `src/shared/service-utils.ts`
2. `src/shared/cookie-consent.ts`
3. `src/routes/[...lang]/layout.tsx` locale mapping via extracted helpers
4. `e2e/home.spec.ts` expansion
5. `src/components/sections/service-grid.tsx` helper extraction if needed
6. Browser-style component tests

## Gating

### After Phase 1

- `bun run test`

### After Phase 2

- `bun run test`

### After Phase 3

- `bun run test`
- `bun run build.types`

### After Phase 4

- `bun run test`
- `bun run test.e2e`

### Final Verification

- `bun run verify`

## Atomic Commits

- Commit 1: helper test baseline (`locale-navigation`, `service-utils`, placeholder cleanup)
- Commit 2: consent helper tests
- Commit 3: extracted loader localization helpers plus tests
- Commit 4: E2E expansion
- Commit 5: optional browser-style component testing setup

## Verification Notes

- As of April 17, 2026, the local Bun runtime is `1.3.12`.
- I also checked public Bun release info, but the indexed web results were stale and inconsistent, so Bun upgrades should be handled as a separate, intentional task instead of bundling them into test work.
