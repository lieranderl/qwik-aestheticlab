# Services UI Refresh

## Goal

Improve the `#services` section so users can scan categories faster, understand what each category contains, and reach booking or price-list actions with less friction.

## Scope

- Refresh the overview cards in `src/components/sections/service-grid.tsx`
- Improve the transition into the detailed category view
- Make service imagery feel supportive instead of blocking readability
- Keep the change within existing Qwik, DaisyUI, and translation patterns

## Non-Goals

- No data-loading changes
- No route structure changes
- No new standalone UI pattern unless the existing `ServiceCard` pattern clearly cannot fit

## Assumptions

- The existing grouped service data and image helpers remain the source of truth
- Inline translation fallbacks are acceptable for any new visible strings
- Mobile-first behavior must remain intact

## Tasks

1. Redesign the overview state to emphasize category label, service count, and clear actions.
2. Improve the detail state with better context, easier back navigation, and more readable service cards.
3. Add only the translation keys needed for the refreshed copy.
4. Verify with `bun run biome` and additional UI-relevant checks.

## Verification

- `bun run biome`
- `bun run build.types`
- `bun run qwik-speak-extract`
