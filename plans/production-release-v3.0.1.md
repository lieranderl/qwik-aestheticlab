# Production Release v3.0.1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Promote the dependency and delivery updates already verified on staging to production as release `v3.0.1`.

**Architecture:** Create a minimal release-version change through the protected staging pull-request flow. Reuse the immutable image digest verified by the resulting staging deployment, then publish an annotated Git tag and GitHub release so the existing workflow performs the protected production canary, smoke tests, full traffic promotion, and watchdog reconciliation.

**Tech Stack:** Bun, GitHub pull requests/releases, GitHub Actions, Artifact Registry, Cloud Run

**Spec:** `.github/DEPLOYMENT.md`

## Scope and Non-goals

- In scope: the `3.0.1` manifest bump, protected staging PR/deployment, annotated release tag, GitHub release, and production promotion verification.
- Out of scope: application behavior changes, dependency changes, infrastructure changes, production configuration changes, and rebuilding a separate production image.

## Assumptions

- The current `staging` commit is healthy and already has a successful verified-digest deployment.
- GitHub environment approval is available for the protected `production` jobs.
- The canonical production URL remains `https://aestheticlab.be`.

## Global Constraints

- Never reuse or move the existing `v3.0.0` release tag.
- The release tag must equal `v$(jq -r .version package.json)` and point at the exact staging-verified commit.
- Production must reuse the staging-verified immutable digest and must not rebuild.
- Production promotion must pass candidate smoke testing, 10/90 canary verification, canonical-domain smoke testing, 100% traffic verification, and the independent watchdog.
- Do not expose runtime secrets or credentials in commands, plans, or logs.

---

### Task 1: Prepare the patch release

**Files:**

- Modify: `package.json`
- Create: `plans/production-release-v3.0.1.md`

**Interfaces:**

- Consumes: staging commit `cb7ab2ac47f9b825c18cf4eef96a3de19273003f`
- Produces: a release branch whose manifest identifies version `3.0.1`; this Bun lock format does not store the root package version

- [ ] **Step 1: Install the frozen baseline and run baseline tests**

  Run `bun ci` and `bun run test`; require exit code 0 and 78 passing tests.

- [ ] **Step 2: Update the package version**

  Change only the root project version from `3.0.0` to `3.0.1` in `package.json`. Confirm `bun.lock` remains unchanged because its root workspace entry does not store the project version.

- [ ] **Step 3: Verify the release tree**

  Run `bun ci`, `bun run verify`, `bun audit --audit-level=high`, and `markdownlint --disable MD013 -- plans/production-release-v3.0.1.md` (using `bunx markdownlint-cli` if the global command is unavailable). Require all commands to exit 0.

- [ ] **Step 4: Commit the release change**

  Commit with subject `chore: prepare v3.0.1 release` and the required `Co-Authored-By: GPT-5 Codex <codex@openai.com>` footer.

### Task 2: Merge and verify staging

**Files:**

- No additional source changes.

**Interfaces:**

- Consumes: the reviewed release commit from Task 1
- Produces: a squash-merged staging commit with a successful verified Cloud Run staging artifact

- [ ] **Step 1: Obtain independent review**

  Review the exact base-to-head diff for version consistency, tag safety, and unintended changes. Resolve all Critical and Important findings before proceeding.

- [ ] **Step 2: Create the protected pull request**

  Push `release/v3.0.1`, open a pull request targeting `staging`, and wait for every required check to succeed.

- [ ] **Step 3: Merge and monitor staging deployment**

  Squash-merge the pull request, delete the remote release branch, and monitor the workflow for the exact merge SHA through quality, build, scan, staging candidate smoke test, 100% staging promotion, and verified-digest tagging.

### Task 3: Publish and verify production

**Files:**

- No source changes.

**Interfaces:**

- Consumes: the exact staging merge SHA and its `verified-<sha>` Artifact Registry digest
- Produces: GitHub release `v3.0.1` and 100% production traffic on its tested Cloud Run revision

- [ ] **Step 1: Create and push the annotated tag**

  Create annotated tag `v3.0.1` at the exact staging merge SHA, verify its peeled commit locally, and push only that tag.

- [ ] **Step 2: Publish the GitHub release**

  Run `gh release create v3.0.1 --verify-tag --title "v3.0.1" --generate-notes`.

- [ ] **Step 3: Monitor protected production promotion**

  Monitor the release-triggered workflow until `production_prepare`, `production`, and `production-watchdog` finish. Require provenance verification, digest re-scan, candidate smoke test, 10/90 canary, canonical-domain smoke test, 100% promotion, and final watchdog success.

- [ ] **Step 4: Verify external state**

  Run `./scripts/smoke-deployment.sh https://aestheticlab.be`, confirm the release targets the exact staging merge SHA, confirm no open pull requests or unused remote release branches remain, and confirm both repository worktrees are clean.

## Verification

- `bun run verify`
- `bun audit --audit-level=high`
- Required pull-request checks
- Staging deployment workflow for the exact merge SHA
- Production deployment workflow for release `v3.0.1`
- `./scripts/smoke-deployment.sh https://aestheticlab.be`
