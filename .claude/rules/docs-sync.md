---
paths:
  - "*.md"
  - ".claude/**/*"
  - "plans/**/*"
---

# Docs Sync Rules

- When workflow expectations change, keep `AGENTS.md`, `CLAUDE.md`, `README.md`, `REVIEW.md`, and `plans/README.md` aligned.
- Prefer updating the smallest authoritative source instead of duplicating long guidance across files.
- Use `.claude/rules/` for path-specific instructions and keep root docs lean.
- Record expected non-blocking warnings rather than repeatedly treating them as new regressions.
