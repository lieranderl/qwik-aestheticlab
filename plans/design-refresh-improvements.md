# Design Refresh Improvements

## Goal

Improve the current Aesthetic Lab design based on the May 2026 review: preserve the botanical luxury direction while fixing conversion, accessibility, motion, and polish issues.

## Scope

- Hero/mobile booking CTA and visual polish.
- Theme-token alignment for rotating hero copy.
- Navigation/mobile menu accessibility.
- Reduced-motion coverage for decorative animations.
- Pricing and services wording polish.
- Reviews marquee Qwik style warning.
- Cookie settings placement if it obstructs mobile content.

## Non-goals

- No data-loader, Supabase schema, deployment, or analytics architecture changes.
- No broad redesign of the brand identity.
- No dependency churn unless required by verification.

## Assumptions

- Existing Qwik, DaisyUI 5, Tailwind v4, Qwik Speak, and local image patterns remain.
- The desired aesthetic remains refined botanical luxury.
- Bun `1.3.13` is current; no Bun upgrade is needed.

## Phases

1. Split implementation across disjoint frontend scopes.
2. Apply and integrate scoped fixes.
3. Run Biome and full verification.
4. Inspect desktop and mobile pages in the browser.
5. Reassess design quality and remaining risks.

## Phase-wise Gating

- After implementation: `bun run biome`.
- After integration: `bun run verify`.
- After verification: browser screenshots for home, services, pricelist, and mobile navigation.

## Atomic Commits

- This task can be committed as one focused design-refresh commit after verification.

## Verification

- `bun run verify` for application code changes.
- Manual browser review for visual layout, mobile hierarchy, and accessibility behavior.
