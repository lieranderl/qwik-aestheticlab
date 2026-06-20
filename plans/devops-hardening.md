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
- [ ] Re-run full verification, container scans, staging promotion, and rollback checks after the second hardening cycle.

## Rollout Safety

- Repository changes land before production IAM is reduced.
- Cloud IAM changes preserve the active runtime secret binding and deploy capability.
- Production traffic remains on the current revision until the hardened artifact passes staging smoke tests.
- Any setting that cannot be safely inferred is codified but not applied silently.

## Remaining Rollout

- Create separate staging and production Supabase projects (or isolated schemas with independently scoped RLS), add distinct publishable/anon keys to `SUPABASE_KEY_STAGING` and `SUPABASE_KEY_PRODUCTION`, and rotate the currently configured `service_role` key out of every application runtime and local environment.
- Apply/import `infra/` to create Artifact Registry, environment-scoped deployers,
  uptime checks, and alerts. The initial repository creation was blocked by the
  current external-operation approval quota.
- Populate the repository and environment variables emitted by OpenTofu before merging to `staging`; WIF identifiers and service-account emails are variables, not secrets.
- Remove this repository's principal from the legacy shared deployer after both new environment deployers succeed.
- Retire legacy Cloud Run revisions, then remove the old Compute service account's final secret-level rollback permission.
- Require the new quality/security checks and pull requests in the `staging` ruleset after the workflow exists on the default branch.

## Second Review Cycle

- [x] Serialize all production releases and add interruption rollback.
- [x] Exclude GitHub OIDC credential files from Git and Docker contexts.
- [x] Verify GitHub provenance and re-scan the exact production digest.
- [x] Build, run, smoke-test, and scan the production container in PR CI.
- [x] Pin the Dockerfile frontend and make cross-platform build stages native-safe.
- [x] Manage a repository-restricted WIF provider and exact environment subjects in OpenTofu.
- [x] Separate staging/production Supabase inputs and reject privileged keys at readiness.
- [x] Add bounded Supabase dependency, content, header, and uptime smoke checks.
- [x] Require immutable bootstrap images and fail closed on missing deployment inputs.
- [x] Reject pre-existing split traffic and reconcile abandoned canaries from a separate runner.
- [x] Add protected saved-plan OpenTofu plan/apply automation and PR validation.
- [x] Alert on production Cloud Run mutations outside delivery and IaC identities.
- [ ] Apply live controls and prove the full staging-to-production path.
