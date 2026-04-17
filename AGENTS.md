# AGENTS.md

## Purpose

Shared agent instructions for this repository. Keep this file concise, factual, and synchronized with the codebase. If more specific `AGENTS.md` files are added in subdirectories later, they override this file for their subtree.

## Instruction Hierarchy

- `AGENTS.md` is the canonical shared policy for all agents.
- `CLAUDE.md` and `.codex/README.md` are short, tool-specific entrypoints that should point back here instead of redefining project policy.
- `REVIEW.md` contains review-only expectations.
- `plans/README.md` defines the durable planning loop and must stay aligned with this file.
- `.claude/rules/*` may add path-scoped detail, but they should not contradict this file.

## Project Snapshot

Aesthetic Lab is a Qwik City marketing site for a nail and beauty studio in Leuven, Belgium. It uses Qwik Speak for five locales (`en-BE`, `ru-BE`, `nl-BE`, `fr-BE`, `uk-BE`), Supabase for SSR-backed content, DaisyUI 5 with Tailwind CSS v4 for styling, and Docker plus Google Cloud Run for deployment.

## Primary Commands

| Action | Command |
| --- | --- |
| Install dependencies | `bun install` |
| Start dev server | `bun run dev` or `make dev` |
| Build production bundle | `bun run build` |
| Type check | `bun run build.types` |
| Lint and format | `bun run biome` |
| Full verification | `bun run verify` |
| Extract i18n keys | `bun run qwik-speak-extract` |
| Build and push Docker image | `make docker-build-push TAG=<tag>` |
| Deploy to Cloud Run | `make gcloud-deploy TAG=<tag>` |

## Verification Policy

- Run `bun run biome` for docs-only or workflow-only changes.
- Run `bun run verify` for application code, build configuration, dependency, loader, or deployment-affecting changes.
- `bun run verify` currently runs Biome, TypeScript, and the production build.
- There is no dedicated automated test suite yet, so manual browser checks are still expected for UI changes. Use screenshots for visual debugging when validating DaisyUI and UI behavior.

### Current Non-Blocking Warnings

- `qwik-speak-inline.log` may report `dynamic key: t(key)` when inline extraction cannot statically resolve a translation key. Treat this as a warning to review, not an automatic build failure.
- `src/global.css` references `/fonts/QESTERO-Regular.ttf`, which is served from `public/fonts/`. Vite may warn that the path stays runtime-resolved during SSR build; this is currently expected unless the font-loading strategy changes.

## Environment Notes

- Required runtime env vars: `SUPABASE_URL` and `SUPABASE_KEY`.
- `make docker-build-push` and `make gcloud-deploy` also require the relevant local Docker and `gcloud` authentication to already be configured.
- If Bun install becomes corrupted, clear Bun cache or reinstall dependencies intentionally rather than editing lockfiles casually.

## Repository Layout

### Repo Root

```text
.claude/         Claude workflow entrypoints, settings, skills, agents, and path-scoped rules
.codex/          Codex-local workflow notes and configuration
.github/         Project guides and automation workflows
.mcp.json        Shared MCP server configuration
Dockerfile       Container build for deployment
i18n/            Extracted translation assets by locale
plans/           Shared planning artifacts
src/             Application source
AGENTS.md        Shared cross-agent instructions
CLAUDE.md        Claude entrypoint that imports AGENTS.md
README.md        Human-facing project overview
REVIEW.md        Review workflow notes
Makefile         Convenience commands for dev, Docker, and deploy
package.json     Scripts and dependency manifest
```

### `src/`

```text
src/
├── routes/
│   ├── plugin.ts
│   ├── index.tsx
│   └── [...lang]/
│       ├── layout.tsx
│       ├── index.tsx
│       ├── pricelist/index.tsx
│       └── (policies)/
├── components/
│   ├── router-head/
│   ├── sections/
│   └── ui/
├── constants/
├── media/
├── shared/
├── consts.ts
├── global.css
├── root.tsx
├── speak-config.ts
├── speak-functions.ts
└── types.ts
```

## File Ownership Rules

| Path | Responsibility |
| --- | --- |
| `src/routes/[...lang]/layout.tsx` | Shared route loaders, locale-aware Supabase mapping, cache headers, cookie banner shell |
| `src/routes/[...lang]/index.tsx` | Home page section composition and page metadata |
| `src/routes/[...lang]/pricelist/index.tsx` | Dedicated price list page |
| `src/components/sections/*` | Full page sections that receive data via props |
| `src/components/ui/*` | Reusable UI primitives and focused interactive widgets |
| `src/shared/supabase-client.ts` | Per-request Supabase client factory |
| `src/shared/cookie-consent.ts` | Consent persistence and Google Consent Mode helpers |
| `src/global.css` | Theme tokens, DaisyUI theme config, animations, global styling |
| `src/types.ts` | Shared TypeScript interfaces |
| `src/speak-config.ts` | Locale definitions |
| `.claude/commands/*` | Claude workflow entrypoints |
| `plans/*` | Durable task plans and implementation notes |

### Sensitive Change Checklist

- For `src/routes/[...lang]/layout.tsx`, preserve locale-aware field mapping, safe fallback returns, and cache behavior unless the task explicitly changes them.
- For `src/global.css`, prefer token or utility changes over one-off global overrides, and verify font or asset paths still resolve from `public/` if touched.

## Critical Conventions

### Qwik

- Always define components with `component$`.
- Use `useSignal` for primitives and `useStore` for nested or collection state.
- Use `useComputed$` and `useTask$` for derived state and side effects.
- Avoid React APIs and patterns entirely.
- Wrap JSX event handler closures with `$()`.
- Keep `routeLoader$` definitions in route files, not reusable components.
- Prefer `~/*` imports for `src/*` paths.
- Avoid `useVisibleTask$` unless the code truly depends on client-only browser APIs.

### Data Loading

- Shared page data belongs in `src/routes/[...lang]/layout.tsx`.
- Locale-specific database field mapping belongs in loaders, not UI components.
- Use the per-request Supabase client from `src/shared/supabase-client.ts`.
- Loader logic must fail soft: log the problem and return safe fallbacks instead of crashing the route.
- When changing loader behavior, keep cache and locale behavior intact unless the task explicitly changes them.

### DaisyUI and Tailwind

- DaisyUI 5 is the default UI layer. Use existing DaisyUI primitives before building custom equivalents.
- Prefer DaisyUI semantic tokens such as `bg-base-100`, `text-base-content`, `btn-primary`, and `badge`.
- Do not hardcode colors unless there is a documented one-off brand exception.
- Tailwind uses CSS-first configuration. Do not add `tailwind.config.js`.
- Theme overrides belong in the DaisyUI theme block in `src/global.css`.
- Use the shared `custom-container` utility for section width and horizontal padding.

### Components

- `src/components/sections/*` are full-width page sections and should stay self-contained.
- `src/components/ui/*` should remain reusable and driven by typed props.
- Compose sections in route files instead of nesting page sections inside each other.
- Check for an existing UI primitive before adding a new one.

### i18n

- Use `inlineTranslate()` inside components.
- Translation keys must use the `key@@Default English Text` pattern.
- After adding or renaming translation keys, run `bun run qwik-speak-extract`.
- Keep supported locales synchronized with `src/speak-config.ts` and extraction settings in `package.json`.

### Images and Media

- For local assets, prefer Vite `?jsx` imports from `src/media`.
- For remote or dynamic images, include meaningful `alt` text and stable sizing.
- Lazy-load below-the-fold media when practical.

### SEO, Analytics, and Accessibility

- Route files should own `DocumentHead` metadata.
- Structured data is defined in `src/constants/metadata.ts` and injected through `src/root.tsx`.
- Google Analytics uses Consent Mode v2 advanced mode; do not reintroduce legacy rejection flows that disable analytics outright. The existing compatibility shim in `src/shared/cookie-consent.ts` may still set `ga-disable-* = false` during bootstrap.
- Interactive elements need accessible names, keyboard support, and sufficient contrast.

### Code Quality

- This repo uses Biome, not ESLint or Prettier.
- Follow the project formatter defaults: tabs, semicolons, double quotes, trailing commas.
- `biome-ignore` comments need a short justification.

## Anti-Patterns

- Do not import React or use React hooks such as `useEffect`, `useState`, or `useRef`.
- Do not put `routeLoader$` inside components.
- Do not map locale-specific Supabase fields inside UI components.
- Do not hardcode hex or rgb colors where DaisyUI theme tokens should be used.
- Do not rebuild buttons, modals, cards, dropdowns, badges, or similar primitives when DaisyUI already covers the use case.
- Do not add `tailwind.config.js`.
- Do not skip `alt` text for meaningful images.
- Do not add ESLint or Prettier-based workflows.
- Do not add translation strings without the `@@` fallback form.
- Do not add duplicate client-side analytics pageview tracking.

## AI Workflow

- For non-trivial work, create or update a plan in `plans/` before implementation.
- Think in responsibilities: planner, implementer, reviewer, and verifier. One agent may hold multiple roles, but a fresh review or verification pass is preferred when available.
- Keep `AGENTS.md`, `CLAUDE.md`, `README.md`, `REVIEW.md`, and `plans/` aligned when shared workflow expectations change.
- If repo structure changes materially, update the layout and ownership sections in this file in the same task.
- If a convention is repeatedly violated in reviews or fixes, record the clarified rule here.
- Prefer rewinding (`/rewind` or `Esc Esc`) over sending a correction prompt when an attempt fails to avoid polluting the context with failed attempts.
- Avoid context rot (intelligence drops after ~300k tokens). Use `/compact` or start fresh sessions for new tasks.

## Additional Repo Guides

- `.github/CODING_STANDARDS.md`
- `.github/COMPONENT_GUIDE.md`
- `.github/DAISYUI_PATTERNS.md`
- `.github/DATA_LOADING.md`
- `.github/DEPLOYMENT.md`
- `.github/I18N_GUIDE.md`
