---
description: Verify changed work with fresh evidence before completion claims or PR preparation.
model: haiku
---

When invoked:

1. Inspect the diff and determine the touched surfaces.
2. Always run `bun run biome`.
3. For code, config, CI, or build-affecting changes, run `bun run verify`.
4. Cross-check `REVIEW.md`.
5. Report only what fresh command output proves.
