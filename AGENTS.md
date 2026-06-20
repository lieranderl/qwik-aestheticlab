# Agent Instructions

## Scope

- Canonical policy; nested `AGENTS.md` files override it for their subtree. Preserve user changes and requested scope.
- Aesthetic Lab uses Qwik City/Qwik Speak, Supabase SSR data, DaisyUI 5, Tailwind CSS 4, Bun, and Cloud Run; follow `plans/README.md` for non-trivial work.

## Package Manager

- Use the Bun version pinned by the repository: `bun install`, `bun run dev`, `bun run verify`.
- Do not change dependencies or `bun.lock` unless the task requires it.

## File-Scoped Commands

| Task | Command |
| --- | --- |
| Check/fix source file | `bunx --bun biome check --write path/to/file` |
| Unit test file | `bunx vitest run path/to/file.test.ts` |
| E2E spec | `bunx playwright test path/to/file.spec.ts` |
| Markdown | `markdownlint --disable MD013 -- path/to/file.md` |

## Verification Matrix

| Change | Required verification |
| --- | --- |
| Docs only | `markdownlint --disable MD013 -- <changed-files>` |
| App, dependencies, build, deployment | `bun run verify` |
| User-facing flow | Relevant Playwright spec; manual browser check for styling |
| Translation keys | Extraction plus affected locale assets |
| IaC | Format, validate, and review plan for each affected environment |

## Key Conventions

- Use Qwik APIs only: `component$`, signals/stores, `$()` handlers; no React APIs.
- Keep `routeLoader$` in route files. Shared data and locale mapping belong in `src/routes/[...lang]/layout.tsx`; use the per-request Supabase client and fail soft.
- Use `~/*` imports, typed props, existing `src/components/ui/*` primitives, DaisyUI semantic tokens, and `custom-container`; do not add `tailwind.config.js`.
- Use `inlineTranslate()` and `key@@Default English Text`; synchronize all five locales with `bun run qwik-speak-extract`.
- Route files own `DocumentHead`; preserve Consent Mode v2, accessibility, meaningful image `alt`, and stable image sizing.
- Biome owns formatting. Do not add ESLint or Prettier.

## DevOps and IaC

- GitHub Actions is the delivery system; authenticate to GCP with OIDC/WIF only.
- Build, scan, attest, and publish once to Artifact Registry; deploy immutable digests and promote the same digest to production.
- Production promotion is triggered by a published release, environment-protected, smoke-tested before traffic migration, and reversible to a prior Cloud Run revision.
- Manage Cloud Run, dedicated least-privilege service accounts, secret bindings, WIF, monitoring, and alerts in `infra/`; after bootstrap, apply only a saved plan through the protected `infrastructure` workflow and never create console-only drift.
- Never expose secrets in source, workflow inputs, image layers, plans, logs, or CLI arguments. Scope Secret Manager access to individual environment secrets; application runtimes may use only Supabase publishable/anon keys, never `service_role` or `sb_secret_*`.

## Git and Commit Attribution

- Use a feature branch. Validate before PR; use `gh` and target `staging`: `gh pr create --fill --base staging`.
- Do not commit, push, create a PR, deploy, or alter cloud resources unless explicitly requested.
- AI commits MUST include `Co-Authored-By: <agent model> <agent attribution email>` using the acting agent's identity.

## References

- Review/deployment/data: `REVIEW.md`, `.github/DEPLOYMENT.md`, `.github/DATA_LOADING.md`.
- UI/i18n: `.github/COMPONENT_GUIDE.md`, `.github/DAISYUI_PATTERNS.md`, `.github/I18N_GUIDE.md`.
- Human setup/entrypoint: `README.md`, `.codex/README.md`.
