# Legal Pages Design Refresh

## Goal

Give the privacy policy and client notice the same navigation, footer, typography, palette, spacing, and editorial surface treatment as the main application, and add reliable separation between the footer copyright and legal links.

## Scope

- Update the shared footer spacing.
- Replace the isolated policy-page chrome with the shared site navigation and footer.
- Recompose both policy pages into a responsive editorial layout without changing their legal meaning.
- Tighten the shared mobile navigation rhythm and stacking, and use the app's standard light surface, so it remains consistent on policy routes.
- Preserve localization, accessibility, metadata, and existing user changes.

## Non-goals

- No legal copy rewrite.
- No dependency, theme, or data-loading changes.
- No deployment, commit, or pull request.

## Assumptions

- The shared `Navigation` and `Footer` are the canonical main-app shell.
- Existing policy translation keys and update dates remain authoritative.

## Phases

1. Adjust the footer copyright/legal row spacing.
2. Rework the policy layout around the shared app shell.
3. Recompose privacy and notice content using the existing DaisyUI theme and components.
4. Refine the shared mobile menu hierarchy, spacing, and overlay priority.
5. Run translation extraction, source checks, tests, build, and focused rendered verification where available.

## Phase-wise Gating

- After phases 1–3: inspect the scoped diff and run Biome on changed source files.
- After phase 3: run focused desktop and mobile visual checks and address in-scope findings.
- Final: run `bun run qwik-speak-extract`, `bun run verify`, and a focused route smoke check if browser preview is available.

## Verification

- Footer items retain visible separation at mobile and desktop widths.
- `/en-BE/privacy-policy/` and `/en-BE/notice/` use shared navigation and footer.
- Both pages remain readable and non-overlapping on small and large viewports.
- The mobile menu uses the standard `base-200` app surface, starts directly below the brand header, uses clean hairline rows, keeps the CTA anchored to the safe-area bottom, and covers cookie controls.
- All translation assets remain synchronized.
- Full project verification passes.
