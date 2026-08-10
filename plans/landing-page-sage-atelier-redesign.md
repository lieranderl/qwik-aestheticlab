# Landing Page Redesign — Sage Atelier

Status: implementation revision completed and verified  
Branch: `codex/landing-page-redesign`  
Concept board: [Sage Atelier landing page](assets/landing-page-sage-atelier-concept.png)

## Goal

Redesign the Aesthetic Lab landing page into a distinctive, conversion-focused
local beauty experience for nails, brows, lashes, and laser treatments in Leuven.
The result should feel cute but grown-up: warm, tactile, polished, and unmistakably
human rather than like a generic beauty template.

## Visual Review Revision — August 2026

The first implementation pass is the baseline for this revision. Preserve its
functional work, but correct the page-level visual hierarchy section by section:

1. Recompose the desktop **Our Work** gallery so it reads as a deliberate editorial
   portfolio, not a rigid image grid. Keep the narrow-screen carousel.
2. Remove the oversized featured quote from **Kind Words** and retain a single,
   compact, user-controlled review carousel with equal-weight review cards.
3. Replace the dark **Booking CTA** strip with a quieter warm-paper/sage invitation
   that belongs to the surrounding page.
4. Give each remaining section an identifiable composition while maintaining one
   shared type, spacing, color, radius, and motion system.
5. Review the complete page at desktop and mobile sizes, then run DaisyUI Blueprint
   Quality Inspector and the repository verification suite.

Non-goals: no new dependencies, no data-model changes, no booking-flow changes,
and no invented claims or policy content.

Completion notes:

- Desktop services use a balanced `7/5` then `5/7` editorial grid without a
  full-height lead card.
- Reviews use one readable Montserrat carousel with no oversized featured quote.
- The gallery keeps its art-directed contact sheet and adds deliberate whitespace
  before the Instagram card.
- The final booking CTA is a compact warm-sage card without dark bands or Aura
  effects.
- Hover motion never translates cards or controls; feedback is limited to color,
  border, shadow, and clipped image scaling.
- DaisyUI Blueprint Quality Inspector passed with no findings, `bun run verify`
  passed, and all 17 Chromium landing-page tests passed.

The design will use daisyUI 5 as its component and semantic-token foundation,
while preserving the project's Qwik City, Qwik Speak, Supabase, booking, analytics,
consent, and accessibility behavior.

## Locked Brand Requirements

- Corporate color: `#8b9687`.
- Use the exact official [Bird.svg](../src/media/Bird.svg) and
  [AestheticLab.svg](../src/media/AestheticLab.svg) assets.
- Do not redraw, recolor destructively, trace, or AI-regenerate either logo.
- The concept board's decorative logo mark is illustrative only. Production uses
  the official SVGs in the navigation, hero brand lockup where appropriate, and
  footer.
- Keep the existing Montserrat and Qestero/Cormorant typography assets; improve
  hierarchy through scale, spacing, and weight rather than adding another font.

## Design Direction

### Concept: Sage Atelier

An editorial beauty atelier with warm ivory paper-like surfaces, soft daylight,
close-up treatment photography, generous margins, and the corporate sage used as
the signature action color. Muted dusty rose appears only as a small playful accent.

The visual personality is:

- warm and intimate, not clinical;
- refined and tactile, not glossy or artificial;
- cute through small details and imagery, not childish decoration;
- editorial and asymmetric, not a stack of equal SaaS cards;
- locally grounded in Leuven, not an anonymous luxury brand.

### What Changes From the Current Page

The current page is polished but visually uniform because `#8b9687` acts as the
large page background. The full-height text-only hero delays imagery and local
proof, while the four equally weighted service cards offer no obvious starting
point.

The redesign will:

- move the corporate sage from page background to brand and action roles;
- make the hero compact, photographic, and immediately specific to Leuven;
- place social proof near the first booking decision;
- give services an editorial hierarchy with real price and duration data;
- merge overlapping team/about storytelling;
- keep one dominant booking action and repeat it only after new evidence;
- make contact, hours, parking, and directions easy to scan near the end;
- add a compact mobile booking bar without obscuring focused content.

## Visual System

### Proposed daisyUI Theme Tokens

| Role | Token | Value | Intended use |
| --- | --- | --- | --- |
| Warm paper | `base-100` | `#fcf9f4` | Main page and card surfaces |
| Pale sage | `base-200` | `#f0f2ed` | Alternating sections and elevated fields |
| Sage border | `base-300` | `#d9ded5` | Borders, separators, muted surfaces |
| Deep forest | `base-content` | `#243027` | Body copy and headings |
| Corporate sage | `primary` | `#8b9687` | Primary actions, key rules, brand moments |
| Dark primary text | `primary-content` | `#152019` | Accessible text on corporate sage |
| Warm taupe | `secondary` | `#6f5c54` | Secondary editorial accents |
| Ivory secondary text | `secondary-content` | `#fcf9f4` | Text on warm taupe |
| Dusty rose | `accent` | `#b87986` | One playful highlight per viewport at most |
| Dark rose text | `accent-content` | `#24191b` | Text on dusty rose |
| Forest neutral | `neutral` | `#273128` | Footer and high-contrast quiet sections |
| Ivory neutral text | `neutral-content` | `#fcf9f4` | Text on forest neutral |

Verified contrast pairs:

- corporate sage / dark primary text: `5.44:1`;
- warm paper / deep forest: `13.09:1`;
- pale sage / deep forest: `12.20:1`;
- dusty rose / dark rose text: `4.97:1`;
- forest neutral / warm paper: `12.85:1`.

White text will not be used on `#8b9687`; that pair is only `3.08:1` and does not
meet normal-text contrast requirements.

### Type, Shape, and Texture

- Display: Qestero with Cormorant Garamond fallback, restrained to headings and
  occasional oversized editorial numerals.
- Interface and body: Montserrat, with normal sentence case for readability.
- Avoid all-uppercase long labels; reserve tracked uppercase for short kickers.
- Corners: `1rem` boxes and full-pill controls through daisyUI theme radii.
- Depth: thin sage-tinted borders and restrained shadows; no glassmorphism.
- Texture: photography, fine rules, small botanical line accents, and offset image
  crops. No gradients, blurred color orbs, neon, or decorative stock icons.

### Motion

- Keep the hero's LCP content visible immediately.
- Use eased 500–700 ms opacity/translation entrances below the fold, with shorter
  color and shadow transitions for interactive controls.
- No autoplaying hero video or review carousel.
- Carousels remain user-controlled and keyboard accessible.
- Preserve reduced-motion behavior and avoid layout-affecting animation.

## Page Architecture

| Order | Section | Design and content | daisyUI foundation |
| --- | --- | --- | --- |
| 1 | Navigation | Official Bird and Aesthetic Lab logos, concise anchors, language switcher, one booking CTA. Transparent over hero only where contrast is guaranteed; solid after scroll. | `navbar`, `dropdown`, `button` |
| 2 | Compact hero | Asymmetric copy-and-image composition. Kicker establishes nails, brows, lashes, laser, and Leuven. One clear headline, short reassurance, Book appointment, and View treatments. Real work photography replaces decorative hero effects. | `hero`, `button`, `badge` |
| 3 | Trust row | Real Google rating/link, Leuven location, appointment/hours cue, and a visible-text status. No invented review count or awards. | `rating`, `status`, `badge` |
| 4 | Treatments | One lead category plus three supporting categories in an editorial layout. Show real starting price and duration from Supabase and link to the full price list. | `card`, `button`, `badge` |
| 5 | Client proof | One dominant review quote followed by a compact, user-controlled mobile carousel of supporting reviews. | `rating`, `carousel`, `card` |
| 6 | Our work | Mixed-size manicure, brow/lash, and treatment imagery with stable aspect ratios. Horizontal carousel only on narrow screens. | `carousel` |
| 7 | People and atelier | Merge team and about storytelling. Use the real staff portraits and bios; provide technician booking actions without turning the section into four identical feature cards. | `avatar`, `card`, `button` |
| 8 | FAQ and policies | Booking, preparation, cancellation, laser, and accessibility questions. Only publish answers backed by salon policy. | `accordion` / `collapse` |
| 9 | Visit us | Address, hours, parking, directions, and the existing lazy map. Make local utility more prominent than decoration. | `card`, `link`, `status` |
| 10 | Final booking invitation | Short, warm close after all evidence; one booking action. | `card`, `button` |
| 11 | Footer | Official logo lockup, essential links, social link, locale/legal details. | `footer`, `link` |

### Primary Copy Direction

- Kicker: “Nails · Brows · Lashes · Laser — Leuven”
- Headline: “Beauty, made beautifully yours.”
- Supporting line: a concise promise about considered treatments, natural results,
  and a calm Leuven studio.
- Primary CTA: “Book appointment”
- Secondary CTA: “View treatments”

This is a copy direction, not final localized content. All five locales will be
updated together through Qwik Speak extraction.

## daisyUI Component Decisions

Use canonical daisyUI markup and modifiers first, then Tailwind utilities for
layout. Custom component CSS is limited to genuinely shared project primitives.

Selected:

- `navbar`, `dropdown`, and `button` for navigation and booking;
- `hero` for the compact asymmetric opening;
- `badge` and `status` for concise, text-backed trust cues;
- `card` only where content truly forms one grouped unit;
- `rating` for display-only, localized review proof;
- `carousel` for narrow-screen work and reviews without autoplay;
- `accordion`/`collapse` for FAQs;
- `avatar` for real staff photography;
- `footer` and `link` for the closing structure.

Explicitly omitted:

- `aura`: too showy for the quiet, tactile direction;
- `stats`: would encourage invented or decontextualized numbers;
- mega-menu: unnecessary for this small information architecture;
- inline booking form: the established GetTimely modal remains the booking path;
- equal repeated feature-card grid: weakens the editorial hierarchy.

Before any JSX is written, run DaisyUI Blueprint's Component Syntax Expert for
the selected component IDs and consume all returned batches. After the cohesive
implementation, run Blueprint's Quality Inspector and apply every returned
`fix_changes` item before verification.

## Photography and Media Direction

### Existing Production Assets

- Hero/atelier candidate: `src/media/gallery/work2.jpg`.
- Nail result candidate: `src/media/gallery/manicure1.jpg`.
- Brows/lashes candidate: `src/media/gallery/eyebrows1.jpg`.
- Team: existing Julia, Lera, Rubina, and Zara portraits.
- Brand: exact official `Bird.svg` and `AestheticLab.svg`.

Existing `lazer1.jpg` is too dark and visually ambiguous for a lead service image.
Use it only if it survives a browser crop test; otherwise request a real salon
laser-treatment photograph before final production polish. A generated image may
be used as a temporary layout placeholder only, clearly tracked for replacement.

### Image Treatment

- Prefer real treatment and staff photography over generic beauty stock.
- Use deliberate portrait and close-up crops with stable width/height metadata.
- Keep skin and nail texture natural; do not over-retouch.
- Eager-load the single hero/LCP image and keep it discoverable in initial HTML.
- Lazy-load below-the-fold images and the map; serve responsive image sizes.
- Do not add a hero video unless authentic salon footage is supplied. If added
  later, it must be muted, optional, poster-backed, and reduced-motion safe.

## Content and Data Guardrails

Use existing Supabase and project content for:

- localized service groups, names, descriptions, prices, and durations;
- technician names, roles, bios, and portraits;
- address, map link, parking, email, and opening hours;
- the existing Google reviews and external review link;
- GetTimely booking behavior and analytics placements.

Do not invent:

- review counts, awards, years in business, customer totals, or treatment metrics;
- “open now” state unless it is calculated from real hours and timezone;
- cancellation, deposit, accessibility, or laser-preparation policy;
- staff credentials or medical claims;
- addresses, team members, prices, or availability shown only in the concept board.

Missing policy answers should be supplied by the salon owner or omitted from the
first implementation.

## Responsive and Accessibility Contract

- Mobile-first at 320 px and up; no horizontal page overflow.
- Minimum 44 px primary touch targets, with at least WCAG 2.2 minimum target sizing
  and adequate spacing for smaller inline links.
- A visible two-pixel focus treatment with at least `3:1` focus contrast.
- Sticky navigation and mobile booking UI must never hide keyboard focus.
- Semantic section headings, landmarks, link purpose, button labels, and image alt.
- Ratings expose one localized accessible label; decorative stars remain hidden.
- Status never relies on color alone.
- Carousels remain operable without dragging and expose meaningful labels.
- Content reflows cleanly at 200% zoom and supports longer Dutch, French, Russian,
  and Ukrainian strings.
- Preserve Consent Mode v2 and defer the map/booking iframe until requested or
  visible according to the existing privacy behavior.

## Scope

### Included

- Landing-page visual system and theme-token refresh.
- Navigation, hero, trust, treatments, reviews, gallery, team/about, FAQ/contact,
  final CTA, and footer composition.
- Existing booking modal and localized route integration.
- Responsive, accessibility, performance, and browser validation.
- All five locale assets for changed copy.

### Non-goals

- Rebuilding GetTimely or changing the booking provider.
- Supabase schema or migration work.
- Redesigning the complete price-list and policy pages beyond shared navigation,
  theme, and footer effects required for consistency.
- Inventing salon policies or marketing proof.
- Replacing the official logos.

## Implementation Phases and Gates

### Phase 0 — Approval and Blueprint Syntax

1. Approve this concept, palette, architecture, and copy direction.
2. Confirm any salon policy content intended for the FAQ.
3. Run Blueprint Component Syntax Expert for every selected component.

Gate: no source implementation begins before design approval and complete component
syntax output.

### Phase 1 — Theme and Shell

1. Update the daisyUI theme tokens and shared surface/section primitives.
2. Rework navigation and footer with exact official SVGs.
3. Preserve language, booking, consent, and analytics behavior.

Gate: file-scoped Biome checks plus desktop/mobile keyboard review of navigation,
logo rendering, and booking access.

### Phase 2 — Conversion Opening

1. Build the compact editorial hero with a real optimized image.
2. Add the proof row using only verified data.
3. Rework the service preview around real price and duration data.

Gate: component tests where behavior changes, mobile and desktop browser review,
no hidden LCP content, no layout shift from imagery.

### Phase 3 — Proof and Story

1. Recompose reviews and work gallery.
2. Merge team/about into one atelier narrative.
3. Add FAQ only for confirmed policy content.

Gate: keyboard/carousel/accordion checks, reduced-motion review, content audit,
and responsive image inspection.

### Phase 4 — Visit and Close

1. Recompose contact, hours, parking, map, and final booking CTA.
2. Update all translation keys and extract all five locales.
3. Check metadata and structured local-business information already supported by
   verified project data.

Gate: translation extraction, affected locale review, booking analytics smoke test,
and relevant Playwright flow.

### Phase 5 — Blueprint and Repository Verification

1. Run Blueprint Quality Inspector on the complete landing-page change.
2. Apply every returned `fix_changes` item.
3. Run `bun run qwik-speak-extract` and `bun run verify`.
4. Run the relevant Playwright spec and manual browser review at phone, tablet,
   laptop, and wide desktop sizes.
5. Check contrast, keyboard flow, focus visibility, 200% zoom, reduced motion,
   LCP image loading, and below-the-fold lazy loading.

Gate: all automated checks pass and the final browser result matches the approved
design direction without fabricated content.

## Commit Strategy

No commit, push, pull request, or deployment is authorized by this plan. If the
user later requests commits, keep them atomic by phase and include the required
AI co-author footer.

## Design References

- [daisyUI themes](https://daisyui.com/docs/themes/) — semantic Tailwind CSS 4
  theme tokens and custom theme configuration.
- [daisyUI colors](https://daisyui.com/docs/colors/) — semantic color usage.
- [WCAG 2.2 changes](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
  — focus visibility, unobscured focus, and minimum target sizing.
- [Optimize Largest Contentful Paint](https://web.dev/articles/optimize-lcp) —
  keep the LCP image discoverable and never lazy-load it.
- [Browser-level image lazy loading](https://web.dev/articles/browser-level-image-lazy-loading)
  — lazy-load only offscreen imagery.

## Concept Board Disclaimer

The concept board is a directional composition study, not a pixel contract. It
contains illustrative copy, people, map details, and a decorative mark. The
implementation will replace all such material with verified project data, real
salon assets, and the exact official SVG logos while preserving the approved
hierarchy, palette, spacing, and editorial character.
