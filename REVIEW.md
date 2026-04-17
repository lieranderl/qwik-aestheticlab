# Review Guidelines

- Treat `AGENTS.md` as the canonical project policy when instructions overlap.
- New visible strings must use `inlineTranslate()` with `@@`.
- UI changes should follow DaisyUI + Qwik conventions from `AGENTS.md`.
- Loader changes stay in route files and return safe fallbacks.
- Workflow changes must keep `AGENTS.md`, `CLAUDE.md`, `README.md`, and `plans/` aligned.
- Path-scoped rules in `.claude/rules/` should stay consistent with the shared guidance in `AGENTS.md`.
- Skip formatting-only noise and non-contradictory markdown nits.
