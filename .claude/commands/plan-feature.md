---
description: Create or refresh a durable implementation plan in plans/ before non-trivial work.
model: sonnet
---

When invoked:

1. Read `AGENTS.md`, `CLAUDE.md`, and `plans/README.md`.
2. If the user's request is ambiguous, interview them with 2-3 targeted questions before drafting the plan.
3. Explore the relevant code before proposing work.
4. Write or update `plans/<task-slug>.md` with the minimum structure from `plans/README.md`. Include Phase-wise Gating (define how each phase will be tested).
5. Assume the next step is Codex plan review unless the user says otherwise.
6. Do not edit application files unless the user explicitly asks to continue.
