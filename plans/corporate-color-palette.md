# Corporate Color Palette

## Goal

Make corporate sage `#8b9687` unmistakably dominant across the site while preserving the existing quiet-luxury direction and accessible contrast.

## Scope

- Refine the single DaisyUI theme in `src/global.css`.
- Use the corporate color on major page and section backgrounds.
- Keep warm ivory for elevated cards and navigation surfaces.
- Update the palette reference documentation.

## Non-goals

- No layout, content, typography, interaction, or image changes.
- No additional theme or dark-mode variant.

## Assumptions

- `#8b9687` remains the exact primary brand color.
- Dark botanical text is preferred over white on corporate sage because it provides stronger visual continuity and accessible contrast.

## Phases

1. Audit semantic color usage and contrast.
2. Refine theme tokens and promote corporate sage to key backgrounds.
3. Run a focused visual and contrast audit plus full project verification.

## Gates

- Palette pairs meet WCAG AA contrast for their intended text sizes.
- Biome, type checking, tests, and production build pass.
- Focused desktop and mobile visual review finds no in-scope regressions.

## Verification

- `bunx --bun biome ci .`
- `bun run build.types`
- `bun run test.coverage`
- `bun run build`
