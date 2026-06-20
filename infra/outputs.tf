output "artifact_registry_image" {
  value = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.containers.repository_id}/${var.image_name}"
}

output "deployer_service_accounts" {
  value = { for environment, account in google_service_account.deployer : environment => account.email }
}

output "runtime_service_accounts" {
  value = { for environment, account in google_service_account.runtime : environment => account.email }
}

output "service_urls" {
  value = { for environment, service in google_cloud_run_v2_service.web : environment => service.uri }
}

output "github_repository_variables" {
  value = {
    GCP_PROJECT    = var.project_id
    GCP_REGION     = var.region
    GAR_REPOSITORY = google_artifact_registry_repository.containers.repository_id
    IMAGE_NAME     = var.image_name
    STAGE_SERVICE  = var.staging_service_name
    PROD_SERVICE   = var.production_service_name
  }
}
