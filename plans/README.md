# Planning Workflow

Use `plans/` for any task larger than a one-file fix.

## Loop

1. Create or update the plan.
2. Review the plan against the actual codebase before implementation when feasible.
3. Implement phase by phase.
4. Verify the result with fresh command output before claiming completion.

## Plan Minimum

- Goal
- Scope or non-goals
- Assumptions
- Small ordered tasks (Phases)
- Phase-wise Gating (Testing checkpoints per phase)
- Atomic Commits (Commit often, at least once per phase)
- Verification

## Verification

- Substantial changes: `bun run verify`
- Docs-only or workflow-only changes: `bun run biome`
- For workflow or environment confusion, run `/doctor-project` before changing shared agent docs.
