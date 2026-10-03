# Editorial Redesign (Direction A)

## Goal

Implement the approved "Direction A — Editorial" design from the design canvas
(<https://claude.ai/artifact/Fb3JJNp7hG91cJ1L2b1HiT>) across the landing page,
price list, policy pages, and error page, mobile-first (80% of visitors).

## Scope

- Theme tokens: square corners, 1px rules, deep-green text, sage as the brand
  surface (hero panel, reviews, visit, consultation band).
- Header (desktop shrink + progress line, active section), phone header over
  the hero photo, phone bottom booking bar.
- Sections: hero, services, reviews, work, team, FAQ, visit, footer.
- Price list, privacy policy, care notes (notice), branded 404, Open Graph tags.
- Motion: existing `FadeUp` (reduced-motion safe), photo wipe reveal, hover zoom.

## Non-goals

- Qwik 2 / i18n library migration (tracked separately).
- GetTimely category renames (studio dashboard), privacy legal-basis wording and
  laser aftercare copy (owner to supply).
- Telephone contact (studio does not publish a phone number).

## Assumptions

- DaisyUI components and Tailwind utilities first; custom CSS only when neither
  can express it.
- Copy changes go through `inlineTranslate()` keys; all five locales stay in sync
  via `bun run qwik-speak-extract`; English values updated in `i18n/en-BE`.
- Rating shown as constants (`googleRating`, `googleReviewCount`) in
  `src/consts.ts` so the studio can update them in one place.

## Phases

1. Libraries (patch updates; Vite stays on 7 because Qwik 1.20 peers `<8`).
2. Theme tokens, `KickerLabel`, navigation, hero, phone bottom bar.
3. Services overview + detail, Face Waxing cover image.
4. Reviews, work, team, FAQ, visit, footer, cookie notice.
5. Price list, privacy, care notes, 404, Open Graph.

## Gating

- Each phase: `bunx --bun biome check --write <files>`, `bun run build.types`,
  manual browser check at 390px and 1440px.
- Phase end: `bun run test`, relevant `e2e/home.spec.ts` updates.
- Final: `bun run verify` and `bun run test.e2e`.

## Verification

`bun run verify`, `bun run test.e2e`, manual phone/desktop browser pass.

## Status (2026-10-03)

All five phases implemented on `feat/editorial-redesign` (not committed).
`bun run verify` and `bun run test.e2e` (81 tests, three browsers) pass.

## Open items for the studio

- English privacy policy and care notes (`i18n/en-BE/app.json`, `app.privacy.*`,
  `app.notice.*`) hold a different, partly newer text than the other four locales,
  stored under mismatched keys, so sections render out of order. The English care
  notes also drop the 5-day complimentary fix. Decide which version is current;
  then align all five locales.
- Laser aftercare steps (care notes, Laser tab shows "Before your session" only).
- Legal basis per processing purpose in the privacy policy.
- GetTimely category names (dashboard) and the Google rating constants in
  `src/consts.ts` (`googleRating`, `googleReviewCount`).

## Review of 3 October 2026 (review.md)

Fixed:

- P1: add-ons are classified by the English base name (`Service.name_en`), so
  starting prices and treatment counts match in all five languages.
- P2: on phones the cookie notice sits at the top, under the header, so the hero
  booking button stays visible. Accept and reject stay equal.
- P2: care notes use a labelled radio group instead of incomplete tab roles.
- Phone hero shows the service summary and "See prices".
- Smaller drifting wordmark; phone category index above the service cards.
- Functional labels (durations, roles, booking buttons, tabs) are 14px sentence
  case; the language picker shows native names.
- Unknown page: one booking button on phones (the bottom bar).

Still open (owner input needed):

- Laser aftercare text (only preparation exists).
- A clean laser category photo (the current one carries Instagram text).

## Follow-up (same day)

- Booking: service IDs are Timely product IDs (verified in the widget), so every
  treatment's Book button now opens that treatment.
- English privacy and care-notes copy now uses the source-code English, which
  mirrors the prevailing Dutch text (incl. the five-day complimentary fix).
- Compact phones (320 x 568): smaller cookie notice; it no longer covers the
  hero headline.
- "Back to categories", treatment reveal and back-to-top scroll through Lenis on
  desktop (native smooth scroll was undone there).

## Link previews and 404 (3 October 2026)

- Share image per language: `public/og/<locale>.jpg` (1200 × 630), rendered
  by `bun run share-images` (`scripts/share-images.ts`) from the taupe photo,
  bird logo, Qestero wordmark, the locale's hero slogan, services and city.
  Re-run it after changing the slogan or the photo.
- `RouterHead` sets `og:image`, `og:image:alt` (translated), `og:locale` with
  `og:locale:alternate`, and matching `twitter:*` tags. `og:title` and
  `og:description` come from each route's head; the home title and
  description now read the same in all five languages.
- 404: white-shimmer photo, sage panel, Book button on every width, and three
  link rows (Services, Prices, Visit) with a one-line note each. The phone
  booking bar and the footer "Ready" band are off on this page, so there is a
  single Book button.

## SEO and video accessibility (3 October 2026)

- Price list: every category (and every laser area) is rendered in the
  server HTML; only the selected one is shown (`hidden`). Category tabs are
  real links (`?category=<id>`) that switch in place with JavaScript and still
  work without it. The canonical stays on `/pricelist/`, which now carries
  all treatments, so search engines no longer need to click.
- Videos: each clip has a 44 px pause / play / replay button (`VideoControl`,
  WCAG 2.2.2), on top of the text layer in the hero and bottom right on each
  work clip. Clicking the video itself does the same. With reduced motion the
  clip never starts by itself; the button shows Play.
