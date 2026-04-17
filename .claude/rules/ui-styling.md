---
paths:
  - "src/components/**/*.tsx"
  - "src/routes/**/*.tsx"
  - "src/global.css"
---

# UI Styling Rules

- Qwik only: no React hooks or React-style state patterns.
- Prefer DaisyUI primitives and semantic theme tokens before custom styling.
- Keep visible text translatable with `inlineTranslate()` and `@@` fallbacks.
- Treat `src/global.css` as shared infrastructure; prefer token and utility changes over one-off global overrides.
- Preserve accessibility basics: accessible names, keyboard behavior, and meaningful alt text.
- If new translation keys are added or renamed, run `bun run qwik-speak-extract`.
