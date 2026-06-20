# Planning Workflow

Use `plans/` for complex or risky work that needs durable sequencing.

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
- Commit Strategy (only when the user explicitly requests commits)
- Verification

## Verification

- Substantial changes: `bun run verify`
- Docs-only Markdown changes: `markdownlint --disable MD013 -- <changed-files>`
- Source, workflow, or config changes: `bunx --bun biome ci .`
- IaC changes: `tofu -chdir=infra fmt -check -recursive`, `tofu -chdir=infra init -backend=false -input=false`, `tofu -chdir=infra validate`

## Maintenance

- Update a plan when assumptions break, scope changes, or verification requirements change.
- Keep plans task-specific; durable project policy belongs in `AGENTS.md` or the nearest scoped guide.
