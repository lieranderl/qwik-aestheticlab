---
description: Start the dev server in the background and monitor logs for SSR or Vite errors while working.
model: haiku
---

When invoked:

1. Execute `bun run dev` as a background process (`is_background: true`).
2. Keep the process running while executing code changes.
3. Check the background process logs periodically or after making changes to ensure there are no Qwik SSR hydration mismatches, Vite build errors, or Supabase connection issues.
4. If errors appear in the background logs, use `/rewind` or fix the issue immediately before proceeding to the next step of the plan.
