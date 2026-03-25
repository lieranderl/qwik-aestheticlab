# Copilot Instructions — Aesthetic Lab

This is a Qwik (NOT React) project. Read `AGENTS.md` at the project root for full context.

## Framework

- Qwik with Qwik City routing — use `component$`, `useSignal`, `useComputed$`, `useTask$`.
- NEVER use React hooks: `useState`, `useEffect`, `useRef`, `useMemo` do not exist here.
- Event handlers require `$()` wrapper: `onClick$={$(() => { ... })}`.
- Imports use `~/` alias: `import { Thing } from "~/shared/thing";`

## UI Library: DaisyUI 5 (Mandatory)

All UI must use DaisyUI 5 components. Reference: https://daisyui.com/components/

- Use `btn`, `modal`, `card`, `dropdown`, `rating`, `badge`, `link`, `carousel`, `divider`, `alert`, `tooltip`, `tabs`, `toggle`, `input`, `select`, `textarea` classes.
- Use DaisyUI color tokens: `bg-primary`, `text-base-content`, `btn-primary`, `bg-base-100`, etc.
- Never hardcode hex or rgb color values — always use theme tokens.
- Theme defined in `src/global.css` via `@plugin "daisyui/theme"` block.
- See `.github/DAISYUI_PATTERNS.md` for project-specific patterns.

## Styling: Tailwind v4

- CSS-first configuration — no `tailwind.config.js` file.
- Section widths: `custom-container` class.
- Fonts: `font-qestero` for display/headings, `font-montserrat` for body text.
- Mobile-first: write base styles, then `md:`, `lg:`, `xl:` breakpoints.
- Scroll animations: use the `FadeUp` component from `~/components/ui/fade-up`.

## i18n: Qwik Speak

- Use `const t = inlineTranslate();` inside every `component$` that has user-facing text.
- Pattern: `t("app.section.key@@Default English Text")` — the `@@` fallback is required.
- After adding new keys: `bun run qwik-speak-extract`.
- Locales: `en-BE`, `ru-BE`, `nl-BE`, `fr-BE`, `uk-BE`.
- Locale-specific DB fields are mapped in `routeLoader$` (layout.tsx), never in components.

## Data Loading

- All Supabase data loaded via `routeLoader$` in `src/routes/[...lang]/layout.tsx`.
- Supabase client: `supabase(event)` from `~/shared/supabase-client.ts`.
- Schema: `client.schema("gettimely").from("table_name")`.
- Error handling: catch errors, log with `console.error`, return `[]` or `null`. Never throw in loaders.
- Components receive already-localized data via props.

## Component Structure

- **Sections** (`src/components/sections/`): Full page blocks with anchor `id`, receive data via props.
- **UI** (`src/components/ui/`): Reusable primitives, no data fetching, typed props interface.
- Named exports for components (except route page `export default`).
- Section header pattern: `font-qestero` h2 + `h-px w-20 bg-primary mx-auto` divider.

## Code Quality

- Linter/formatter: **Biome** (not ESLint or Prettier).
- Tabs, double quotes, semicolons always, trailing commas always.
- TypeScript strict mode — no `@ts-ignore`. Prefer `unknown` over `any`.
- Run `bun run biome` to check/fix.

## Dependencies

- Always use latest stable versions when adding new packages.
- Runtime: Bun. Build: Vite 7.x.

## Anti-Patterns (Never Do These)

- ❌ React imports or hooks
- ❌ `tailwind.config.js` (Tailwind v4 = CSS-first)
- ❌ Hardcoded colors (use DaisyUI tokens)
- ❌ Custom buttons/modals/cards when DaisyUI has the component
- ❌ `routeLoader$` inside component files
- ❌ Missing `alt` on images or `type="button"` on non-submit buttons
- ❌ `eslint` or `prettier`
- ❌ Outdated or deprecated packages
- ❌ Translation strings without `@@Default` fallback

## Detailed Guides

- `AGENTS.md` — Architecture, all conventions, tech stack
- `.github/CODING_STANDARDS.md` — Qwik patterns, TS rules, formatting
- `.github/DAISYUI_PATTERNS.md` — Theme tokens, component patterns, z-index
- `.github/I18N_GUIDE.md` — Translation workflow, locale management
- `.github/DATA_LOADING.md` — Supabase patterns, error handling, caching
- `.github/COMPONENT_GUIDE.md` — Templates, FadeUp/Booking usage, checklist
- `.github/DEPLOYMENT.md` — Build, Docker, Cloud Run, CI/CD