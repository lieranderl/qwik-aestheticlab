# Pricelist Conversion Improvement

## Goal

Make `/pricelist/` easier to scan and let visitors book from the treatment they are considering while preserving the current quiet-luxury visual direction.

## Scope

- Refine the existing pricelist route only.
- Preserve localized Supabase service/category data, navigation, footer, analytics, and the existing booking modal.
- Improve hierarchy, responsive treatment rows, and treatment-level booking actions.
- Do not change service data, booking-provider configuration, global theme tokens, or unrelated landing-page work.

## Assumptions

- Existing working-tree changes belong to the user and must be preserved.
- Service IDs are analytics identifiers; the booking widget continues to open at the location level because no external booking product ID exists in the `Service` model.

## Phases

1. Review the current route, project UI conventions, and DaisyUI guidance.
   - Gate: confirm the existing data model and booking component contract.
2. Rework the page hierarchy and treatment rows.
   - Gate: focused formatting and type checking for the changed route.
3. Audit the changed UI and perform rendered responsive checks where available.
   - Gate: focused desktop and mobile `/pricelist/` browser checks.
4. Run project verification and inspect the final diff.
   - Gate: `bun run verify` succeeds, or any unrelated pre-existing failure is recorded precisely.

## Verification

- `bunx --bun biome check src/routes/[...lang]/pricelist/index.tsx`
- `bun run build.types`
- Focused browser smoke check at desktop and mobile widths
- `bun run verify`
- Final `git diff` review limited to task-owned files
