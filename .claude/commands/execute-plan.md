---
description: Execute a reviewed plan from plans/ phase by phase, keeping docs and verification in sync.
model: sonnet
---

When invoked:

1. Read the requested plan in `plans/`.
2. Confirm the next unchecked task and affected files before editing.
3. Implement one phase at a time.
4. Update the plan when tasks or assumptions change.
5. If the plan breaks, revise it before continuing.
6. Run fresh verification before claiming success.
