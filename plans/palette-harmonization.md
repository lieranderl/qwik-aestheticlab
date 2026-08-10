# Palette Harmonization

## Goal

Create a smoother warm-sage palette across every public route while retaining the site's quiet-luxury identity and accessible text contrast.

## Scope

- Audit shared theme tokens and route-level surface usage.
- Apply the selected palette through the existing DaisyUI semantic theme.
- Review the home, price list, privacy policy, and important information routes on desktop and mobile.
- Preserve layout, content, images, interaction behavior, and user-owned changes.

## Assumptions

- The site remains a single light theme.
- Shared semantic tokens are the source of truth; route-specific colors are unnecessary unless rendered review exposes an exception.
- The Color Designer palette is the visual basis: warm ivory, warm stone, softened sage, olive ink, walnut, and dusty berry.

## Phases

1. Inventory semantic color usage and all public routes.
2. Define a warm tonal ladder and verify foreground/background contrast.
3. Update the DaisyUI theme and its project documentation.
4. Render representative desktop and mobile views for every route family.
5. Run DaisyUI inspection and the full project verification suite.

## Phase Gates

- Palette gate: normal text contrast remains at least 4.5:1 on its paired semantic background.
- Route gate: no abrupt cool/dark surface remains without an intentional semantic purpose.
- Responsive gate: no new overflow or unreadable content at mobile and desktop widths.
- Quality gate: DaisyUI Quality Inspector permits finalization.

## Verification

- Focused rendered checks for `/en-BE/`, `/en-BE/pricelist/`, `/en-BE/privacy-policy/`, and `/en-BE/notice/`.
- `bun run verify`
- `git diff --check`
