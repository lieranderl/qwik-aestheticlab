# Planning Workflow

Use `plans/` for any task larger than a one-file fix.

## Loop

1. Claude Code writes or updates the plan.
2. Codex reviews the plan against the codebase and appends `## Codex Findings`.
3. Claude Code implements phase by phase.
4. Codex verifies the result with fresh command output.

## Plan Minimum

- Goal
- Scope or non-goals
- Assumptions
- Small ordered tasks
- Verification

## Verification

- Substantial changes: `bun run verify`
- Docs-only or workflow-only changes: `bun run biome`
