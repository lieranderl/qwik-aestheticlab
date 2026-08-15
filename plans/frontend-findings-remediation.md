# Frontend Findings Remediation

## Goal

Resolve the frontend review findings across accessibility, booking resilience,
localization, locale-aware formatting, browser coverage, and maintainability.

## Scope

- Make the mobile navigation and gallery lightbox keyboard-accessible.
- Preserve booking and contact actions when Supabase contact data is unavailable.
- Remove known translation fallbacks and format prices for the active locale.
- Strengthen browser interaction coverage across supported Playwright engines.
- Decompose the gallery/lightbox and service catalogue interaction code.

Non-goals: no visual redesign, schema changes, production deployment, or changes
to unrelated user-owned package updates.

## Assumptions

- The configured booking location remains the safe fallback when contact data is
  missing or malformed.
- Native `<dialog>` is the supported modal foundation for the existing browser
  targets.
- Existing customer-review quotations remain in their original language.

## Phases

1. Repair navigation, lightbox, booking, contact, and reduced-motion behavior.
2. Add locale-aware currency/rating output and synchronize all five locales.
3. Extract focused gallery and catalogue helpers/components.
4. Expand Playwright and unit coverage for the repaired flows.
5. Run translation extraction, formatting, types, unit coverage, production build,
   and relevant Playwright tests.
6. Deliver through a feature-branch pull request to `staging`, then monitor the
   staging Cloud Run workflow through completion.

## Phase-wise Gating

- Phase 1: changed source files pass Biome and keyboard flows have explicit tests.
- Phase 2: extraction reports no missing literal keys and locale assets are aligned.
- Phase 3: public component contracts remain typed and route loaders stay unchanged.
- Phase 4: Chromium, Firefox, and WebKit cover the critical interaction subset.
- Phase 5: `bun run verify` and the relevant Playwright suite pass.
- Phase 6: PR checks pass, the PR is squash-merged, and the staging deployment
  workflow completes successfully.

## Commit Strategy

- Create one feature-branch commit for the reviewed frontend remediation and MCP
  cleanup, including the required AI co-author footer.
- Squash-merge the verified pull request into `staging`; do not deploy or tag
  production.

## Verification

- `bun run qwik-speak-extract` — passed; 193 literal keys extracted with no
  dynamic-key warnings.
- `bun run verify` — passed; 78 unit tests, coverage thresholds, type checking,
  Biome, and production build are green.
- Chromium E2E — all 23 flows passed (22 in the full run and the corrected
  pricelist assertion in a focused rerun).
- Firefox/WebKit — current browser revisions downloaded; this workstation lacks
  their Ubuntu host libraries. CI now installs all browser dependencies and runs
  the same suite across Chromium, Firefox, and WebKit.
- `git diff --check` — passed.

## Outcome

- Replaced the mobile drawer label trigger with a keyboard-operable button and
  preserved focus trapping/restoration.
- Added a native-dialog gallery viewer with localized controls, arrow-key
  navigation, backdrop/Escape close behavior, and trigger focus restoration.
- Made booking resilient to missing contact locations and retained a contact
  fallback when Supabase data is unavailable.
- Localized prices, rating accessibility text, and repaired English fallback
  drift across all five locale assets.
- Extracted booking and service-catalogue view-model helpers with unit coverage,
  and split the gallery viewer out of the grid component.
- Expanded E2E linting and CI browser coverage to all configured Playwright
  engines.
