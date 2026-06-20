# Review Guidelines

- Apply `AGENTS.md`; report only actionable findings introduced by the change.
- Prioritize correctness, security, regressions, missing tests, and deployment safety over style.
- Start with findings ordered by severity; cite file and tight line range for each finding.
- State “No findings” when appropriate, then list residual test gaps or risks.
- Verify new visible strings use `inlineTranslate()` with `@@` and all locales remain synchronized.
- Verify loaders stay in route files, preserve locale/cache behavior, use the per-request client, and fail soft.
- Verify UI follows Qwik and existing DaisyUI primitives, remains keyboard-accessible, and uses semantic tokens.
- Verify dependency changes are necessary, reflected in `bun.lock`, and free of avoidable high/critical advisories.
- Verify delivery builds once, uses immutable Artifact Registry digests, promotes the same artifact, and authenticates through OIDC/WIF.
- Verify Cloud Run/IAM/secret/monitoring changes are declared in `infra/`, least-privilege, and rollback-safe.
- Reject any leaked `.env`, secret value, service-role key, `sb_secret_*` key, sensitive plan output, or credential in logs.
- Skip formatting-only noise and non-contradictory Markdown nits.
