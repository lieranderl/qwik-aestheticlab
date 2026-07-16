# Qwik and TypeScript Modernization

## Goal

Bring application components, routes, dependencies, and performance-sensitive patterns to current production-grade Qwik and TypeScript standards while preserving behavior and existing in-progress work.

## Scope

- Audit every file under `src/components/` and relevant composition under `src/routes/`.
- Refactor verified correctness, resumability, accessibility, maintainability, and performance issues.
- Update direct dependencies to the latest mutually compatible stable versions.
- Update focused tests and translations when behavior or user-facing keys change.

## Non-goals

- No visual redesign, Supabase schema changes, deployment, commit, push, or PR.
- No speculative abstraction or dependency replacement without a demonstrated benefit.
- No edits to generated output.

## Assumptions

- Existing uncommitted changes are intentional and must be preserved.
- "Latest" means the newest stable versions compatible with Qwik, Bun, and the repository's build pipeline; incompatible major upgrades require an explicit documented deferral.
- Existing public behavior and localized content remain stable unless a defect requires a focused correction.

## Phases

1. Inventory the dirty worktree, component ownership, tests, build configuration, and dependency graph.
2. Run parallel read-only audits for sections/routes, UI primitives, and dependencies/performance.
3. Integrate scoped fixes in non-overlapping ownership areas, reviewing each diff against existing changes.
4. Synchronize translations and update focused unit/E2E coverage where necessary.
5. Run Biome, type checking, unit tests, production build, and relevant Playwright/manual browser verification.

## Phase-wise Gating

- Phase 1: every component and relevant route/config file is assigned or reviewed.
- Phase 2: findings identify exact files, impact, and concrete fixes; unsupported stylistic churn is rejected.
- Phase 3: file-scoped Biome and type checks pass for each integration batch.
- Phase 4: translation extraction is run only if keys change; affected tests pass.
- Phase 5: `bun run verify` passes, followed by relevant Playwright coverage and a production dependency audit.

## Commit Strategy

No commits are authorized. Leave the verified working tree for user review.

## Verification

- `bunx --bun biome ci .`
- `bun run build.types`
- `bun run test`
- `bun run build`
- `bun run verify`
- Relevant `bunx playwright test ...` specs for changed user-facing flows
- Dependency version and security audit after lockfile update

## Outcome

- Audited every application component and relevant route through three parallel Qwik/TypeScript workstreams.
- Updated all direct packages to their latest compatible stable releases; retained Vite 7.3.6 because Qwik 1.20.0 declares support for Vite versions below 8.
- Removed unused direct dependencies and resolved duplicate Vite installations and build warnings.
- Improved loader localization, invalid URL-state handling, canonical URLs, lazy/above-fold behavior, QRL/listener usage, accessible names, dialogs, dropdowns, ratings, and static rendering work.
- Synchronized gallery alt text across all five locales and added focused browser regressions.
- Final gates passed: `bun run verify`, 37 unit tests, 48 Playwright tests across Chromium/Firefox/WebKit, and `bun audit` with zero vulnerabilities.
