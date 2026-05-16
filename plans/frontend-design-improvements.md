# Frontend Design Improvements

## Goal

Improve the current Aesthetic Lab frontend based on the design review: preserve the botanical editorial luxury direction while tightening mobile conversion, reducing oversized cards, and removing non-essential hero media for faster first view.

## Design Direction

- Aesthetic: refined botanical editorial minimalism.
- DFII: 13 = high context fit, clean implementation, strong performance safety, low consistency risk.
- Differentiation anchor: oversized wordmark, restrained editorial rules, and compact treatment catalogue rhythm instead of generic large card grids.
- FFCI: 8 = scoped Qwik/DaisyUI styling changes with low state and loader risk.

## Scope

- Home page hero, services, team, reviews, gallery/contact supporting styles where needed.
- Pricelist page mobile category navigation and CTA finish.
- Cookie banner/settings placement.
- CSS theme utilities and responsive refinements.
- Mobile density pass for cards, section spacing, image heights, and CTA sizing.

## Non-Goals

- No dependency upgrades or package churn.
- No data model, Supabase loader, analytics contract, or locale routing changes.
- No full content rewrite beyond concise UI labels already present.
- No new heavy frontend libraries or additional above-the-fold imagery.

## Assumptions

- Current dirty worktree changes are user-owned and should be preserved.
- The existing sage/ink/white identity remains the brand baseline.
- DaisyUI remains the component layer, with custom styling used only to create a more distinctive editorial surface.

## Phases

1. Patch global design utilities and cookie placement.
2. Simplify hero media and mobile action sizing.
3. Compress service, team, review, and contact cards on mobile.
4. Improve pricelist mobile category navigation and bottom CTA styling.
5. Run formatter/type/build verification and browser-check desktop/mobile.

## Phase Gates

- After phase 2: mobile hero CTA must remain visible without loading hero photos.
- After phase 3: team must avoid orphan-card layout on desktop.
- After phase 4: pricelist nav must show horizontal scroll affordance on mobile.
- Final: `bun run biome` and, if feasible, `bun run verify`.

## Atomic Commits

No commits unless requested. Keep changes grouped by UI responsibility for easy review.

## Verification

- `bun run biome`
- `bun run verify` for application code changes
- Browser screenshots at desktop and mobile for home/services/pricelist
