# AI Agent Workflow Adoption

Status: historical. Current canonical policy is `AGENTS.md`; current planning and review entry points are `plans/README.md` and `REVIEW.md`. The Claude-specific rollout described below has been superseded by the agent-agnostic instruction refresh in `plans/agent-instruction-refresh.md`.

## Goal

Adopt a tool-native Claude Code + Codex workflow for this repository without changing application behavior.

## Scope

- add the baseline `.claude/` surface for shared Claude Code workflows
- add a minimal `.codex/` surface for Codex-specific guidance
- add shared MCP configuration
- formalize durable plans in `plans/`
- align `README.md`, `CLAUDE.md`, `AGENTS.md`, and `REVIEW.md`
- align PR verification with the documented workflow

## Non-Goals

- no UI or runtime behavior changes
- no dependency upgrades beyond workflow support
- no heavy hook automation in the first rollout
- no agent-team-by-default workflow

## Assumptions

- Claude Code remains the primary planner and implementer for this repo
- Codex is used as the second-model reviewer and verifier
- conservative MCP coverage is preferred over many integrations
- shared docs are more important than personalized local automation

## Phase 1

- [x] Add durable planning guidance in `plans/README.md` and this implementation spec.
- [x] Add baseline Claude Code settings, commands, skills, and reviewers under `.claude/`.
- [x] Add minimal Codex project guidance under `.codex/`.
- [x] Add `.mcp.json` with browser-testing and docs-research servers.
- [x] Add `REVIEW.md` for review-only rules.
- [x] Align core docs and CI with the shared workflow.

## Phase 2

- [ ] Add targeted hooks only for hard invariants:
  - block React hooks in Qwik files
  - flag hardcoded colors in UI files
  - flag translation strings missing `@@`
- [ ] Add more path-scoped skills if recurring work appears in loaders, UI, or release management.
- [ ] Add `.claude/settings.local.example.json` for personal overrides that stay out of git.

## Phase 3

- [ ] Evaluate managed Claude Code review on pull requests using `REVIEW.md`.
- [ ] Add a repo-specific PR template that asks for plan path, verification evidence, and doc updates.
- [ ] Add CODEOWNERS if the team wants explicit review ownership for workflow files.

## Decisions

- Keep `AGENTS.md` as the canonical project policy instead of moving policy into generated command files.
- Keep `CLAUDE.md` short and pointer-based instead of turning it into a second large rule file.
- Use subagents before agent teams because this repo’s work is usually sequential and file-coupled.
- Keep MCP narrow in phase 1 to reduce tool noise and permission complexity.
- Enforce reality with CI and `REVIEW.md`, not only with prose documentation.

## Verification

- `bun run biome`
- `bun run verify`

## Done When

- the repo has a committed Claude/Codex workflow surface
- planning and verification expectations are durable and discoverable
- CI reflects the documented workflow
- future workflow changes have a clear place to live
