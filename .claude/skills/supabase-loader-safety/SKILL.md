---
name: supabase-loader-safety
description: Use when changing route loaders, locale-aware Supabase mapping, or shared data-fetching behavior in Aesthetic Lab.
---

# Supabase Loader Safety

Read `AGENTS.md` first, then `.github/DATA_LOADING.md` for the touched route or shared loader surface.

Use this skill when working on loader or Supabase-backed data flow:

- keep loader logic in route files, especially `src/routes/[...lang]/layout.tsx`
- use the per-request Supabase client from `src/shared/supabase-client.ts`
- preserve locale-aware field mapping in loaders instead of UI components
- fail soft with logs plus safe fallback values
- preserve cache behavior unless the task explicitly changes it
- prefer `bun run verify` after loader, env, or Supabase access changes
