# DevOps Hardening

## Goal

Close the repository, delivery, container, IAM, observability, and documentation gaps identified in the 2026-06-20 audit.

## Workstreams

- [x] Make builds reproducible, minimal, non-root, scanned, and attested.
- [x] Promote one immutable image digest through staging and production.
- [x] Add non-mutating CI, E2E smoke coverage, security gates, and protected environments.
- [x] Define Cloud Run, Artifact Registry, IAM, secrets, monitoring, and uptime checks as OpenTofu.
- [x] Add application security headers and production-safe health behavior.
- [x] Replace broad runtime IAM with a dedicated least-privilege identity.
- [x] Enable GitHub secret scanning, push protection, and protected environments.
- [ ] Migrate deployer IAM and enforce the new repository rules.
- [x] Align release metadata, Makefile, deployment docs, and agent guidance.
- [x] Run full verification, container scans, and live smoke checks.

## Rollout Safety

- Repository changes land before production IAM is reduced.
- Cloud IAM changes preserve the active runtime secret binding and deploy capability.
- Production traffic remains on the current revision until the hardened artifact passes staging smoke tests.
- Any setting that cannot be safely inferred is codified but not applied silently.

## Remaining Rollout

- Apply/import `infra/` to create Artifact Registry, environment-scoped deployers,
  uptime checks, and alerts. The initial repository creation was blocked by the
  current external-operation approval quota.
- Populate GitHub repository variables and environment-scoped WIF secrets before merging to `staging`.
- Remove this repository's principal from the legacy shared deployer after both new environment deployers succeed.
- Retire legacy Cloud Run revisions, then remove the old Compute service account's final secret-level rollback permission.
- Require the new quality/security checks and pull requests in the `staging` ruleset after the workflow exists on the default branch.
