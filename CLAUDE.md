# CLAUDE.md

This is the entry point for Claude-based AI agents working on the Aesthetic Lab project.

## Quick Reference

Read `AGENTS.md` for the full project context, conventions, and rules. For deeper topics, see the skill files in `.github/`:

| File | Topic |
|------|-------|
| `AGENTS.md` | Project snapshot, architecture, all critical conventions, anti-patterns |
| `.github/CODING_STANDARDS.md` | Qwik patterns, TypeScript rules, formatting, imports |
| `.github/DAISYUI_PATTERNS.md` | DaisyUI 5 component usage, theme tokens, z-index scale |
| `.github/I18N_GUIDE.md` | Qwik Speak translation patterns, locale management |
| `.github/DATA_LOADING.md` | Supabase routeLoader$ patterns, error handling, caching |
| `.github/COMPONENT_GUIDE.md` | Section vs UI components, FadeUp/Booking usage, new component checklist |
| `.github/DEPLOYMENT.md` | Build pipeline, Docker, Cloud Run, CI/CD |

## Essential Rules (Do Not Skip)

1. **DaisyUI 5 is mandatory** for all UI — buttons, modals, cards, dropdowns, ratings, etc. Reference: https://daisyui.com/components/
2. **Use latest stable versions** of all packages. Never install outdated or deprecated dependencies.
3. **Qwik only** — no React hooks (`useState`, `useEffect`, `useRef`). Use `component$`, `useSignal`, `useTask$`, `$()`.
4. **Translations** use `inlineTranslate()` with `t("app.section.key@@Default English")` pattern. Never skip the `@@` fallback.
5. **Data loading** happens in `routeLoader$` inside `layout.tsx` — never in components.
6. **Theme colors** use DaisyUI tokens (`bg-primary`, `text-base-content`) — never hardcode hex values.
7. **Biome** is the linter/formatter — not ESLint or Prettier. Run `bun run biome` before committing.

## Commands

```sh
bun install                  # Install dependencies
bun run dev                  # Dev server (SSR mode)
bun run build                # Production build
bun run biome                # Lint + format
bun run qwik-speak-extract   # Extract new translation keys
```

## Self-Improvement Protocol

When working on this project, update the documentation:

- **New pattern discovered** → append to the relevant `.github/*.md` file.
- **New dependency added** → verify it's latest stable, update `AGENTS.md` tech stack table.
- **Convention violated causing a bug** → add to the Anti-Patterns section in `AGENTS.md`.
- **New DaisyUI component introduced** → document in `.github/DAISYUI_PATTERNS.md`.
- **Significant refactor** → update the architecture section in `AGENTS.md`.