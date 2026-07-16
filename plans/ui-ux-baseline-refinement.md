# UI/UX Baseline Refinement

## Goal

Improve the clean Git baseline without redesigning the brand or replacing working
business interactions. The application must remain light-only, use the existing
corporate palette unchanged, and behave consistently across supported routes and
viewports.

## Scope

- Shared theme activation, navigation, focus behavior, touch targets, and motion.
- Main-page hero, service drill-down, landmarks, reviews semantics, and responsive
  behavior.
- Pricelist and policy-route consistency, accessibility, and empty/error handling.
- Focused regression coverage for the changed user-facing flows.

## Non-goals

- No corporate color changes.
- No route, Supabase query, booking integration, or analytics contract changes.
- No new dependencies or animation libraries.
- No wholesale section reorder or visual redesign.
- No replacement of the existing in-page `View Treatments` drill-down.

## Assumptions

- The Git `HEAD` state is the accepted visual baseline.
- The toolbar only needs to preserve the relative order of the sections it links to;
  it does not need a link for every supporting section.
- Existing translated database content and five-locale Qwik Speak behavior remain
  authoritative.

## Audit findings

- DaisyUI `--radius-box` resolves to `2rem`, while most explicit card utilities use
  `rounded-2xl` (`1rem`), so visually equivalent surfaces currently have different
  corner radii.
- Main-page section padding ranges from `4rem` to `8rem`, section headings range
  from `2.25rem` to `4.5rem`, and supporting copy drops below the preferred mobile
  reading size in several cards.
- The hero's DaisyUI rotating-text treatment visibly overlaps at mobile and desktop
  sizes because the display font extends outside the component's one-line clipping
  box.
- Motion durations range from `150ms` to `1200ms`; some interactions animate
  layout (`padding`, `max-height`) or expensive paint properties (`filter`, large
  blur/backdrop surfaces).
- The reviews marquee duplicates every review in the DOM, randomizes the order on
  the client, and runs indefinitely. This increases hydration work, harms semantic
  clarity, and made full-page visual capture unreliable.
- The fixed full-page grain layer, large blurred decorations, looping pulse/float
  effects, and grayscale map transition add paint cost without improving task
  completion.

## Phases and gates

1. **Shared foundation**
   - Enforce the existing Aesthetic theme as light-only.
   - Align DaisyUI box radius with the established `rounded-2xl` card standard and
     introduce shared section, heading, body, surface, and motion primitives.
   - Correct landmarks, navigation semantics, mobile focus lifecycle, language menu,
     touch targets, and reduced-motion behavior.
   - Gate: Biome, typecheck, navigation/theme Playwright checks.
2. **Primary flow**
   - Make the hero own the first viewport.
   - Replace the overlapping rotating headline with a stable, readable responsive
     treatment and keep hero LCP content immediately visible.
   - Preserve and make service category drill-down restorable/shareable.
   - Replace the randomized, duplicated review marquee with a native scroll-snap
     rail and resolve high-impact text/control accessibility issues.
   - Gate: home tests at 320, 390, 430, 768, 1024, and 1440 widths.
3. **Secondary routes and states**
   - Apply the same card radius, type scale, spacing, and control sizing to the
     pricelist and policy routes; add useful empty/loading/error treatment only
     where the data model supports it.
   - Gate: route-specific Playwright checks and locale verification.
4. **Final verification**
   - Run translation extraction if keys changed, `bun run verify`, relevant
     cross-browser E2E tests, manual keyboard/reduced-motion checks, and diff review.
   - Confirm no hero text overlap, no document overflow, consistent computed card
     radii, and no long-running decorative animation at audited viewports.

## Commit strategy

No commit, push, pull request, or deployment unless explicitly requested.

## Verification

- `bunx --bun biome ci .`
- `bun run verify`
- Relevant Playwright specs in Chromium, Firefox, and WebKit.
- Manual checks at 320, 390, 430, 768, 1024, and 1440 pixels.
- Confirm exact corporate tokens and `color-scheme: light` under simulated dark OS
  preference.
