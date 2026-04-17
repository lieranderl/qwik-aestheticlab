---
description: Inspect shared project configuration, known warnings, and verification health before changing workflow docs or debugging agent setup.
model: haiku
---

When invoked:

1. Read `AGENTS.md`, `CLAUDE.md`, `README.md`, `REVIEW.md`, and `plans/README.md`.
2. Inspect `.claude/settings.json`, `.claude/rules/`, `.claude/commands/`, and `.claude/skills/` for drift or contradictions.
3. Inspect `package.json`, `Makefile`, `src/global.css`, and `qwik-speak-inline.log` when present.
4. Report current verification expectations, known non-blocking warnings, and any stale workflow docs.
5. Run `bun run biome` by default.
6. If code, config, or build surfaces are implicated, run `bun run verify`.
7. Recommend the smallest doc or config fix set that would restore consistency.
