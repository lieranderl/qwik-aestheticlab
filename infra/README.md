# OpenTofu infrastructure

## Scope

- Artifact Registry Docker repository with cleanup policies
- Dedicated staging/production Cloud Run runtime identities
- Separate staging/production GitHub deployers with exact environment-scoped WIF subjects
- Secret-level Supabase access; no project-wide secret role
- Cloud Run v2 services, probes, scaling, and public invocation
- Production localized-page uptime plus 5xx, p95 latency, instance saturation, runtime-failure, and Supabase-loader alerts

## Bootstrap

1. Create a remote GCS state bucket with versioning, uniform access, and retention outside this root.
2. Pass the state bucket and prefix with `tofu init -backend-config=bucket=BUCKET -backend-config=prefix=aestheticlab`.
3. Copy `terraform.tfvars.example` to an untracked `terraform.tfvars` and set all required values.
4. Authenticate with a bootstrap identity authorized to enable APIs and create IAM resources.
5. Run `tofu init`, `tofu plan -out=tfplan`, review it, then `tofu apply tfplan`.
6. Add the `github_repository_variables` output to GitHub repository variables.
7. Add `GCP_WORKLOAD_ID_PROVIDER` and the matching `deployer_service_accounts` value as `GCP_SERVICE_ACCOUNT` in each GitHub environment; both the build and staging jobs use the `staging` environment.
8. Configure required reviewers on the GitHub `production` environment.

This root creates the secret container but never a secret version. Add the Supabase key directly through Secret Manager, then grant secret-administration access only to the human/bootstrap identity that rotates it.
Set `supabase_secret_version` to the tested numeric version; deployments never follow the mutable `latest` alias.

## Existing resources

Import existing resources before the first plan; do not recreate live services. Examples:

```sh
tofu import google_artifact_registry_repository.containers projects/PROJECT/locations/REGION/repositories/REPOSITORY
tofu import google_secret_manager_secret.supabase_key projects/PROJECT/secrets/SUPABASE_KEY
tofu import 'google_cloud_run_v2_service.web["staging"]' projects/PROJECT/locations/REGION/services/STAGING_SERVICE
tofu import 'google_cloud_run_v2_service.web["production"]' projects/PROJECT/locations/REGION/services/PRODUCTION_SERVICE
```

Import service accounts and IAM resources as needed, then reconcile the plan. Set `deletion_protection = false` only during initial import if the provider requires it; restore it before apply.

After both environment-scoped deployers have completed a successful deployment:

1. Remove the `qwik-aestheticlab` repository principal from the legacy shared `github-deployer` service account while retaining the other repositories' principals.
2. Keep only secret-level `SUPABASE_KEY` access on the legacy Compute service account during the rollback window.
3. Retire old revisions that use the legacy identity, verify no traffic references them, then remove that final secret binding.
4. Do not remove shared-service-account project roles until its other repositories have migrated to dedicated identities.

## Deployment contract

OpenTofu owns service configuration and IAM. GitHub Actions owns only the container image and exact-revision traffic promotion. Image and traffic fields are intentionally ignored after bootstrap so a later plan cannot roll back a digest or promote an untested revision.

Production releases must reference a commit previously built and scan-verified from `staging`. If the immutable `verified-<commit>` tag is absent, release deployment fails without changing Cloud Run.
