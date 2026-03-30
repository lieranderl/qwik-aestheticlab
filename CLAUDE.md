# CLAUDE.md

This is the Claude Code entry point for this repository.

## Read First

1. `AGENTS.md`
2. `plans/README.md`
3. `REVIEW.md`
4. The relevant `.github/*.md` guide for the files you are touching

## Default Workflow

- Use `plans/` for non-trivial work.
- Claude Code plans and implements.
- Codex reviews plans and verifies results.
- Keep `AGENTS.md`, `README.md`, `REVIEW.md`, and `plans/` aligned when workflow files change.

## AI Surface

- `.claude/commands/`
- `.claude/skills/`
- `.claude/agents/`
- `.codex/README.md`
- `.mcp.json`

## Key Commands

- `bun run dev`
- `bun run biome`
- `bun run build.types`
- `bun run build`
- `bun run verify`
- `bun run qwik-speak-extract`
