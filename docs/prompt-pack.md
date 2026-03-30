# Prompt Pack

Reusable prompts for this repository.

Read these first before using the pack:

- `CLAUDE.md`
- `AGENTS.md`
- `plans/README.md`
- `REVIEW.md`

These prompts are designed for the current workflow:

- Claude Code plans and implements
- Codex reviews plans and verifies results

## Planning Prompt For Claude Code

```text
Read CLAUDE.md, AGENTS.md, and plans/README.md first.

Goal:
[Describe the change you want.]

Scope:
- [files or areas in scope]
- [user-visible behavior in scope]

Out of scope:
- [things that must not change]

Constraints:
- Follow AGENTS.md exactly.
- Keep Qwik patterns only, no React patterns.
- Use DaisyUI primitives and theme tokens.
- Keep routeLoader$ logic in route/layout files.
- Keep user-facing strings compatible with qwik-speak.
- Avoid duplicated policy or unnecessary new docs.

Deliverable:
Create or update a durable plan at:
plans/[task-slug].md

Plan requirements:
- goal
- scope / non-goals
- assumptions
- small ordered tasks
- verification
- risks or follow-ups

Do not implement yet unless I explicitly ask.
```

## Plan Review Prompt For Codex

```text
Read AGENTS.md, REVIEW.md, and plans/README.md first.

Review this plan against the actual codebase:
plans/[task-slug].md

Rules:
- Inspect the real files before judging the plan.
- Do not rewrite the original phases.
- Append a section titled:
## Codex Findings
- Add only missing steps, risks, sequencing fixes, verification gaps, or convention conflicts.
- Flag any conflict with AGENTS.md, current repo structure, or existing workflows.

Output:
1. Update the plan file.
2. Summarize the top 3 highest-risk findings.
```

## Implementation Prompt For Claude Code

```text
Read CLAUDE.md, AGENTS.md, plans/[task-slug].md, and any relevant .github guide first.

Execute the next phase from:
plans/[task-slug].md

Constraints:
- Stay within scope.
- Do not silently expand the task.
- If assumptions break, update the plan before continuing.
- Keep instructions lean and avoid duplicate docs.
- If workflow files change, keep AGENTS.md, CLAUDE.md, README.md, REVIEW.md, and plans/ aligned.

Deliverable:
Implement only the next planned phase and summarize:
- files changed
- what was completed
- any plan updates
- residual risks

Before claiming success:
run fresh verification evidence appropriate to the change.
```

## Verification Prompt For Codex

```text
Read AGENTS.md, REVIEW.md, and plans/[task-slug].md first.

Verify the implementation against:
plans/[task-slug].md

Check:
- required files were changed
- repo conventions were preserved
- no duplicated or contradictory workflow guidance was introduced
- docs stayed aligned if workflow/config files changed
- the implementation matches the approved plan

Verification:
- Run bun run biome
- If code/config/CI/build behavior changed, run bun run verify
- Report only what fresh command output proves

Output:
- pass/fail status
- concrete findings with file references
- residual risks if no blocking issues exist
```

## Small Bugfix Prompt

```text
Read CLAUDE.md and AGENTS.md first.

Fix this issue:
[bug description]

Scope:
- likely files: [path1], [path2]
- keep the change minimal

Constraints:
- preserve current architecture
- no unrelated refactors
- follow Qwik, DaisyUI, i18n, and loader rules from AGENTS.md

Deliverable:
- fix the bug
- explain root cause briefly
- run the smallest relevant verification plus bun run biome
```

## UI Change Prompt

```text
Read AGENTS.md, .github/DAISYUI_PATTERNS.md, and .github/COMPONENT_GUIDE.md first.

Goal:
[describe the UI change]

Scope:
- component(s): [paths]
- route(s): [paths]

Constraints:
- DaisyUI 5 first
- use theme tokens, no hardcoded colors
- Qwik only
- all visible strings must stay translatable
- preserve mobile-first behavior
- do not invent a new component pattern if an existing one fits

Deliverable:
Implement the UI change and summarize:
- reused patterns
- any new translation keys
- accessibility considerations

Verification:
Run bun run biome and any additional checks relevant to the UI change.
```

## Loader / Supabase Change Prompt

```text
Read AGENTS.md and .github/DATA_LOADING.md first.

Goal:
[describe the data-loading change]

Scope:
- route or layout files: [paths]
- dependent UI files: [paths]

Constraints:
- all server data loading stays in route files
- components receive props only
- handle errors safely
- locale field mapping stays in loaders
- no data-fetching logic moved into UI components

Deliverable:
Implement the change and summarize:
- query changes
- fallback behavior
- any type/interface updates

Verification:
Run bun run verify
```

## Docs Alignment Prompt

```text
Read AGENTS.md, CLAUDE.md, REVIEW.md, and plans/README.md first.

Task:
Audit and align the repo’s workflow and agent-facing docs.

Check:
- AGENTS.md is the canonical policy
- CLAUDE.md is a thin entrypoint
- README.md is onboarding-oriented
- REVIEW.md contains review-only guidance
- plans/README.md contains planning workflow only
- .claude and .codex files do not duplicate policy unnecessarily

Deliverable:
Make the smallest edits needed to reduce duplication and contradiction.

Verification:
Run bun run biome
```

## New Feature Prompt

```text
Read CLAUDE.md, AGENTS.md, and plans/README.md first.

Goal:
Add [feature name].

Scope:
- in scope: [routes/components/docs/config]
- out of scope: [unrelated pages, infra, redesigns]

Constraints:
- create a plan first
- follow repo conventions exactly
- prefer extending existing patterns over adding new abstractions
- document only what is truly new

Deliverable:
1. Write plans/[feature-slug].md
2. Wait for review before implementation
```

## Refactor Prompt

```text
Read CLAUDE.md, AGENTS.md, and the relevant .github guides first.

Goal:
Refactor [target] to improve [clarity / duplication / maintainability].

Constraints:
- no behavior change unless explicitly required
- no broad cleanup outside touched scope
- preserve current architectural boundaries
- reduce duplication, not increase abstraction for its own sake

Deliverable:
- explain current problem briefly
- make the refactor
- note any doc updates required

Verification:
Run bun run verify
```

## Good Habits

- Name the deliverable file.
- Say what is out of scope.
- Tell the agent whether it is planning, implementing, reviewing, or verifying.
- Require fresh verification.
- Keep prompts short and let `AGENTS.md` carry the stable rules.
