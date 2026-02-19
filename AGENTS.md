# AGENTS.md

## Project Snapshot
Aesthetic Lab is a Qwik-based marketing site for a nail/beauty studio. It uses Qwik City routing, Qwik Speak for i18n, Supabase for content data, and DaisyUI + Tailwind v4 for styling. Runtime is Bun (local) with Vite for dev/build.

## Key Commands
- `bun install`
- `bun run dev` or `make dev`
- `bun run build`
- `bun run biome`
- `bun run qwik-speak-extract`

## Architecture Map
- Routes
- `src/routes/[...lang]/index.tsx`: Main home page composition.
- `src/routes/[...lang]/layout.tsx`: Data loaders (Supabase) + caching; locale-aware content mapping.
- `src/routes/[...lang]/(policies)/...`: Legal pages.
- Components
- `src/components/sections/*`: Page sections (hero, services, gallery, etc.).
- `src/components/ui/*`: Reusable UI elements (booking modal, fade animation, cards).
- Data + Types
- `src/shared/supabase-client.ts`: Server-side Supabase client.
- `src/types.ts`: Shared data contracts for services, staff, contact, groups.
- i18n
- `src/speak-config.ts`, `src/speak-functions.ts`: Qwik Speak config and loader.
- `i18n/*/app.json`: Translations for UI strings.

## i18n Rules (Qwik Speak)
- Use `inlineTranslate()` for UI strings in components.
- Prefer the `key@@Default English` pattern already used in the codebase.
- When adding new strings, update `i18n/<lang>/app.json` and run `bun run qwik-speak-extract` if needed.

## Styling Rules
- Tailwind v4 + DaisyUI are configured via `src/global.css`.
- Theme tokens live in the `@plugin "daisyui/theme"` block; avoid inline colors unless needed.
- Use `custom-container` for section widths.
- Animations are standardized via `FadeUp` + CSS utilities in `src/global.css`.

## Data Loading Rules
- Server data comes from Supabase in `src/routes/[...lang]/layout.tsx` via `routeLoader$`.
- Locale-specific fields are mapped in loaders, not in UI components.
- Keep loaders resilient: return empty arrays or `null` on error.

## SEO + Analytics
- Head metadata is set in route files via `DocumentHead`.
- Google Analytics configuration is in `src/consts.ts` (`ga` export).

## Conventions
- Prefer `component$` + Qwik signals/hooks.
- Keep section composition in page routes, not inside sections.
- Reuse existing UI components before adding new ones.
