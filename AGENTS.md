# AGENTS.md

## Project Snapshot

Aesthetic Lab — Qwik City marketing site for a nail/beauty studio in Leuven, Belgium. Multi-language (en/ru/nl/fr/uk), Supabase-backed content, DaisyUI 5 + Tailwind v4 styling, deployed via Docker to Google Cloud Run.

## Commands

| Action | Command |
|--------|---------|
| Install | `bun install` |
| Dev server | `bun run dev` or `make dev` |
| Production build | `bun run build` |
| Type check | `bun run build.types` |
| Lint/format | `bun run biome` |
| Verify | `bun run verify` |
| Extract i18n keys | `bun run qwik-speak-extract` |
| Docker build+push | `make docker-build-push TAG=<tag>` |
| Deploy Cloud Run | `make gcloud-deploy TAG=<tag>` |

## Tech Stack

- Qwik / Qwik City 1.x
- Tailwind CSS v4 + DaisyUI 5
- Bun + Vite 7 + Biome 2
- qwik-speak + Supabase SSR + TypeScript strict mode
- When adding or upgrading dependencies, use the latest stable version and check changelogs before major bumps.

## Architecture

```
src/
├── routes/
│   ├── plugin.ts                     # Locale middleware (runs on every request)
│   ├── index.tsx                     # Root redirect
│   └── [...lang]/
│       ├── layout.tsx                # routeLoader$ for Supabase data + CookieBanner
│       ├── index.tsx                 # Home page — composes section components
│       ├── pricelist/index.tsx       # Dedicated price list page
│       └── (policies)/              # Legal pages (privacy, notice)
├── components/
│   ├── sections/                     # Full page sections (hero, services, team, etc.)
│   └── ui/                           # Reusable UI primitives (FadeUp, Booking, GoogleAnalytics, etc.)
├── shared/                           # Utilities (Supabase client, cookie consent, etc.)
├── constants/                        # Static metadata, nav config
├── .claude/                          # Claude Code commands, skills, agents, shared settings
├── .codex/                           # Codex workflow docs and local configuration
├── media/                            # Images and SVGs (vite ?jsx imports)
├── plans/                            # Shared planning artifacts for Claude Code + Codex workflow
├── types.ts                          # Shared TypeScript interfaces
├── consts.ts                         # Formatting helpers, GA ID, booking URL
├── global.css                        # Tailwind + DaisyUI theme + animations
├── speak-config.ts                   # Qwik Speak locale config
├── speak-functions.ts                # Translation loader (server$)
└── root.tsx                          # App shell, QwikCityProvider, QwikSpeak
```

## File Ownership Rules

| File/Directory | Responsibility |
|----------------|---------------|
| `routes/[...lang]/layout.tsx` | ALL Supabase data loading via `routeLoader$` |
| `routes/[...lang]/index.tsx` | Home page section composition only |
| `components/sections/*` | Self-contained page sections — receive data via props |
| `components/ui/*` | Reusable, stateless-ish UI components |
| `shared/supabase-client.ts` | Single Supabase client factory |
| `shared/cookie-consent.ts` | Cookie consent persistence + Google Consent Mode v2 helpers |
| `global.css` | Theme tokens, animations, DaisyUI plugin config |
| `types.ts` | All shared data interfaces |
| `speak-config.ts` | Locale definitions (add new locales here) |
| `.claude/settings.json` | Shared Claude Code defaults and project-local permissions |
| `.claude/commands/*` | Claude Code workflow entrypoints for planning, execution, and verification |
| `plans/*` | Durable task plans and implementation specs reviewed by Claude Code and Codex |

## Critical Conventions

### Qwik Patterns

- **Always** use `component$` for components.
- Use `useSignal` / `useComputed$` / `useTask$` for state — never `useState` or React patterns.
- Closures passed to JSX event handlers must use `$()` (e.g., `onClick$={$(() => { ... })}`).
- Avoid `useVisibleTask$` unless client-only APIs (DOM, localStorage, IntersectionObserver) are absolutely required. Prefer `useTask$` with `isServer` guards when possible.
- Keep `routeLoader$` in layout/route files only, never in components.
- Use `~/*` path aliases (mapped to `src/*`).

### DaisyUI — Mandatory UI Library

**All UI must use DaisyUI 5 components.** Reference: https://daisyui.com/components/

Key rules:
- Use DaisyUI class names (`btn`, `card`, `modal`, `dropdown`, `rating`, `badge`, `divider`, `link`, `carousel`, etc.) before writing custom CSS.
- Use DaisyUI color tokens (`bg-base-100`, `text-base-content`, `btn-primary`, `bg-primary`, etc.) — **never** hardcode hex colors unless the design system demands a one-off accent.
- Use DaisyUI size modifiers (`btn-sm`, `btn-lg`, `card-body`, etc.) for consistent sizing.
- `<dialog>` elements use DaisyUI's `modal` pattern: `<dialog class="modal">` + `<div class="modal-box">`.
- Theme is defined via `@plugin "daisyui/theme"` block in `global.css` — all color overrides go there.
- When a DaisyUI component exists for the use case, **use it**. Do not rebuild buttons, modals, cards, dropdowns, ratings, or other primitives from scratch.

### Styling

- Tailwind v4 CSS-first config — no `tailwind.config.js`.
- Theme tokens live in the `@plugin "daisyui/theme"` block in `global.css`.
- Use `custom-container` class for section max-width + horizontal padding.
- Fonts: `font-qestero` (display/headings), `font-montserrat` (body).
- Animations: use the `FadeUp` component for scroll-triggered reveals. Custom keyframe animations are defined in `global.css`.
- Respect `prefers-reduced-motion` — `global.css` already handles this.
- Mobile-first responsive design: start with base styles, add `md:` and `lg:` breakpoints.

### i18n (Qwik Speak)

- **Always** use `inlineTranslate()` inside components: `const t = inlineTranslate();`
- String pattern: `t("app.section.key@@Default English Text")`
- The `@@` separator provides the fallback — do not omit it.
- Supported locales: `en-BE`, `ru-BE`, `nl-BE`, `fr-BE`, `uk-BE` (Belgian variants).
- After adding new translation keys, run `bun run qwik-speak-extract`.
- Translation files live in `i18n/<locale>/app.json`.
- Locale-specific Supabase fields are mapped in `layout.tsx` loaders, NOT in UI components.

### Data Loading

- All server data flows through `routeLoader$` in `routes/[...lang]/layout.tsx`.
- Supabase client is created per-request via `supabase(event)` from `shared/supabase-client.ts`.
- Env vars `SUPABASE_URL` and `SUPABASE_KEY` are required — accessed via `event.env.get()`.
- Loaders must be resilient: catch errors, log them, and return empty arrays or `null`.
- Locale-specific field mapping (e.g., `name_ru`, `description_fr`) happens in loaders using `requestEv.locale().split("-")[0]`.

### Component Design

- **Sections** (`components/sections/*`): Full-width page blocks. Receive data via props. Each owns its own `id` for anchor navigation.
- **UI** (`components/ui/*`): Reusable, composable elements. Accept configuration via typed props.
- Section composition happens in route page files (e.g., `index.tsx`), not inside other sections.
- Before creating a new UI component, check existing ones in `components/ui/`.

### Images

- Use Vite `?jsx` import for local images: `import Img from "~/media/photo.jpg?jsx";` → `<Img class="..." alt="..." />`
- For dynamic/Supabase images, use `<img>` with explicit `width`/`height` or `aspect-*` classes.
- Always provide meaningful `alt` text.

### SEO

- `DocumentHead` export in route files for title + meta description.
- JSON-LD structured data defined in `constants/metadata.ts`, injected in `root.tsx`.
- Canonical URLs derive from locale-prefixed routes.

### Analytics & Consent

- Google Analytics is implemented with Google Consent Mode v2 advanced mode in production only.
- Consent defaults are set before any Google measurement command in `root.tsx` via `getGoogleAnalyticsBootstrapScript()`.
- EEA-safe defaults: `analytics_storage`, `ad_storage`, `ad_user_data`, and `ad_personalization` are denied before consent.
- The cookie banner only asks for analytics consent, so accepting analytics grants `analytics_storage` only; advertising consent remains denied.
- Do not use `ga-disable-*` for normal reject/deny flows because advanced mode requires consent-aware cookieless pings.
- Qwik City client-side page views are tracked by `components/ui/google-analytics.tsx`; avoid adding duplicate route tracking elsewhere.

### Code Quality

- Biome handles linting and formatting (not ESLint/Prettier).
- Indentation: tabs (Biome config).
- Semicolons: always.
- Trailing commas: always.
- Quotes: double.
- Run `bun run biome` before committing.
- Husky + lint-staged auto-run Biome on staged files.
- `biome-ignore` comments require justification.

### AI Agent Workflow

- For non-trivial changes, create or update a plan in `plans/` before implementation.
- Default loop: Claude Code plans and implements, Codex reviews and verifies.
- Keep shared agent behavior in `.claude/`, project-local Codex guidance in `.codex/`, and workflow docs aligned.

### Accessibility

- All interactive elements need accessible labels (`aria-label`, visible text, or `title`).
- Decorative icons use `aria-hidden="true"`.
- Color contrast must meet WCAG AA against the theme palette.
- Keyboard navigation must work for modals, dropdowns, and mobile menu.

### Performance

- Qwik's lazy-loading is automatic — don't eagerly import components.
- Images use `loading="lazy"` for below-fold content.
- Iframes (booking widget, map) only render when needed (conditional `isOpen` signal).
- Cache headers are set in `layout.tsx` `onGet` handler.

## Anti-Patterns — Do NOT

- ❌ Import React or use React hooks/patterns.
- ❌ Use `useEffect`, `useState`, or `useRef` — these are React, not Qwik.
- ❌ Hardcode hex/rgb colors — use DaisyUI theme tokens.
- ❌ Build custom buttons, modals, cards, dropdowns when DaisyUI has a component for it.
- ❌ Add `tailwind.config.js` — Tailwind v4 uses CSS-first configuration.
- ❌ Put `routeLoader$` inside components — they belong in route/layout files.
- ❌ Skip `alt` attributes on images.
- ❌ Use `eslint` or `prettier` — this project uses Biome exclusively.
- ❌ Install outdated or deprecated packages — always use latest stable versions.
- ❌ Create translation strings without the `@@Default Text` fallback pattern.
- ❌ Map locale-specific DB fields inside UI components — do it in loaders.
- ❌ Use `ga-disable-*` for cookie-banner rejection — update Consent Mode state instead.

## Self-Updating Rules for AI Agents

When working on this project, AI agents should:

1. **Before generating code:** Re-read the relevant section of this file to confirm patterns.
2. **After adding a dependency:** Verify it's the latest stable version. Update the Tech Stack table above if it's a significant addition.
3. **After adding new components:** If the component introduces a new pattern or convention, append it to the relevant section of this file.
4. **After encountering a bug caused by a violated convention:** Add the violation to the Anti-Patterns section with a brief explanation.
5. **After learning project-specific DaisyUI patterns:** Document them in a `.github/DAISYUI_PATTERNS.md` file for reference.
6. **After significant refactors:** Update the Architecture section and File Ownership Rules to reflect the new structure.
7. **Periodically:** Check `package.json` dependency versions against latest releases and flag outdated packages.
