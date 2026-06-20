# Agent Instruction Refresh

## Goal

Reduce instruction drift across the project's agent-facing docs and make the workflow usable by any agent, not only a fixed Claude/Codex pairing.

## Scope

- refresh `AGENTS.md` as the canonical workflow and policy document
- align `README.md`, `REVIEW.md`, `code_review.md`, `plans/README.md`, `.codex/README.md`, `.github/copilot-instructions.md`, `.clinerules`, `.agents/skills/`, and `docs/prompt-pack.md`
- fix verification guidance for docs-only versus code-affecting work
- update stale repo layout and ownership details when needed

## Non-Goals

- no application behavior changes
- no command or CI changes
- no new automation hooks

## Assumptions

- `AGENTS.md` should remain the canonical shared instruction source
- planning in `plans/` is still expected for non-trivial work
- review and verification may be handled by a second agent or by the same agent when no separate reviewer is available
- removed legacy assistant surfaces should not be recreated unless explicitly requested

## Phases

1. Audit the current instruction surfaces and identify contradictions.
2. Update `AGENTS.md` to be canonical, current, and agent-agnostic.
3. Trim the pointer docs so they defer to `AGENTS.md` instead of restating conflicting workflow details.
4. Run markdown verification and record the outcome.

## Phase-wise Gating

- Phase 1: Confirm the contradictions are evidenced in the current files before editing.
- Phase 2: Keep the updated `AGENTS.md` aligned with the actual repo structure and current app behavior.
- Phase 3: Ensure the secondary docs do not reintroduce workflow contradictions.
- Phase 4: Run Markdown linting plus safe project checks from `AGENTS.md`.

## Commit Strategy

- Commit only if explicitly requested.

## Verification

- `markdownlint --disable MD013 -- <changed Markdown files>`
- `bunx --bun biome ci .`
- `bun run build.types`
- `bun run test`
- `bun run build`
