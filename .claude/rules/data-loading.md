---
paths:
  - "src/routes/[...lang]/**/*.tsx"
  - "src/shared/supabase-client.ts"
---

# Data Loading Rules

- Keep shared page data loading in `src/routes/[...lang]/layout.tsx` unless the route boundary itself changes.
- Preserve locale-aware field mapping in loaders; do not move that logic into UI components.
- Use the per-request Supabase client from `src/shared/supabase-client.ts`.
- Fail soft: log problems and return safe fallbacks instead of crashing the route.
- Preserve cache behavior unless the task explicitly changes cache semantics.
- After loader or Supabase changes, prefer fresh `bun run verify`.
