locals {
  services = {
    staging = {
      name          = var.staging_service_name
      min_instances = var.staging_min_instances
      max_instances = var.staging_max_instances
    }
    production = {
      name          = var.production_service_name
      min_instances = var.production_min_instances
      max_instances = var.production_max_instances
    }
  }

  required_apis = toset([
    "artifactregistry.googleapis.com",
    "iam.googleapis.com",
    "iamcredentials.googleapis.com",
    "monitoring.googleapis.com",
    "run.googleapis.com",
    "secretmanager.googleapis.com",
    "sts.googleapis.com",
  ])
}

resource "google_project_service" "required" {
  for_each = local.required_apis

  project            = var.project_id
  service            = each.value
  disable_on_destroy = false
}

resource "google_artifact_registry_repository" "containers" {
  location      = var.region
  repository_id = var.artifact_registry_repository
  description   = "Aesthetic Lab deployable containers"
  format        = "DOCKER"

  cleanup_policy_dry_run = false

  cleanup_policies {
    id     = "retain-recent"
    action = "KEEP"
    most_recent_versions {
      keep_count = 30
    }
  }

  cleanup_policies {
    id     = "delete-old"
    action = "DELETE"
    condition {
      tag_state  = "ANY"
      older_than = "7776000s"
    }
  }

  depends_on = [google_project_service.required]
}

resource "google_secret_manager_secret" "supabase_key" {
  secret_id = var.supabase_secret_id
  replication {
    auto {}
  }

  depends_on = [google_project_service.required]
}

resource "google_service_account" "runtime" {
  for_each = local.services

  account_id   = "aesthetic-${each.key == "production" ? "prod" : "stage"}-runtime"
  display_name = "Aesthetic Lab ${each.key} Cloud Run runtime"
}

resource "google_service_account" "deployer" {
  for_each = local.services

  account_id   = "aesthetic-${each.key == "production" ? "prod" : "stage"}-deployer"
  display_name = "Aesthetic Lab ${each.key} GitHub deployer"
}

resource "google_secret_manager_secret_iam_member" "runtime_access" {
  for_each = google_service_account.runtime

  secret_id = google_secret_manager_secret.supabase_key.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${each.value.email}"
}

resource "google_service_account_iam_member" "github_wif" {
  for_each = google_service_account.deployer

  service_account_id = each.value.name
  role               = "roles/iam.workloadIdentityUser"
  member             = var.github_workload_identity_principals[each.key]
}

resource "google_artifact_registry_repository_iam_member" "staging_deployer_writer" {
  project    = var.project_id
  location   = google_artifact_registry_repository.containers.location
  repository = google_artifact_registry_repository.containers.repository_id
  role       = "roles/artifactregistry.writer"
  member     = "serviceAccount:${google_service_account.deployer["staging"].email}"
}

resource "google_artifact_registry_repository_iam_member" "production_deployer_reader" {
  project    = var.project_id
  location   = google_artifact_registry_repository.containers.location
  repository = google_artifact_registry_repository.containers.repository_id
  role       = "roles/artifactregistry.reader"
  member     = "serviceAccount:${google_service_account.deployer["production"].email}"
}

resource "google_service_account_iam_member" "deployer_act_as" {
  for_each = google_service_account.runtime

  service_account_id = each.value.name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${google_service_account.deployer[each.key].email}"
}

resource "google_cloud_run_v2_service" "web" {
  for_each = local.services

  name                = each.value.name
  location            = var.region
  deletion_protection = var.deletion_protection
  ingress             = "INGRESS_TRAFFIC_ALL"

  template {
    service_account                  = google_service_account.runtime[each.key].email
    max_instance_request_concurrency = var.container_concurrency
    execution_environment            = "EXECUTION_ENVIRONMENT_GEN2"

    scaling {
      min_instance_count = each.value.min_instances
      max_instance_count = each.value.max_instances
    }

    containers {
      image = var.initial_image

      ports {
        container_port = 3000
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "1Gi"
        }
        cpu_idle          = true
        startup_cpu_boost = true
      }

      env {
        name  = "SUPABASE_URL"
        value = var.supabase_url
      }

      env {
        name = "SUPABASE_KEY"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.supabase_key.secret_id
            version = var.supabase_secret_version
          }
        }
      }

      startup_probe {
        initial_delay_seconds = 0
        timeout_seconds       = 3
        period_seconds        = 5
        failure_threshold     = 12
        http_get {
          path = "/readyz"
          port = 3000
        }
      }

      liveness_probe {
        initial_delay_seconds = 10
        timeout_seconds       = 3
        period_seconds        = 10
        failure_threshold     = 3
        http_get {
          path = "/healthz"
          port = 3000
        }
      }
    }
  }

  lifecycle {
    ignore_changes = [
      template[0].containers[0].image,
      traffic,
    ]
  }

  depends_on = [
    google_project_service.required,
    google_secret_manager_secret_iam_member.runtime_access,
  ]
}

resource "google_cloud_run_v2_service_iam_member" "public" {
  for_each = var.allow_public_access ? google_cloud_run_v2_service.web : {}

  project  = var.project_id
  location = each.value.location
  name     = each.value.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_v2_service_iam_member" "deployer" {
  for_each = google_cloud_run_v2_service.web

  project  = var.project_id
  location = each.value.location
  name     = each.value.name
  role     = "roles/run.developer"
  member   = "serviceAccount:${google_service_account.deployer[each.key].email}"
}

resource "google_monitoring_uptime_check_config" "localized_page" {
  display_name = "Aesthetic Lab production /en-BE/"
  timeout      = "10s"
  period       = "60s"

  http_check {
    path         = "/en-BE/"
    port         = 443
    use_ssl      = true
    validate_ssl = true
  }

  monitored_resource {
    type = "uptime_url"
    labels = {
      host       = var.production_uptime_host
      project_id = var.project_id
    }
  }
}

resource "google_monitoring_alert_policy" "server_errors" {
  display_name          = "Aesthetic Lab production 5xx responses"
  combiner              = "OR"
  notification_channels = var.notification_channel_ids

  conditions {
    display_name = "5xx response rate is non-zero"
    condition_threshold {
      filter          = "resource.type = \"cloud_run_revision\" AND resource.labels.service_name = \"${var.production_service_name}\" AND metric.type = \"run.googleapis.com/request_count\" AND metric.labels.response_code_class = \"5xx\""
      comparison      = "COMPARISON_GT"
      threshold_value = 0
      duration        = "60s"

      aggregations {
        alignment_period     = "60s"
        per_series_aligner   = "ALIGN_RATE"
        cross_series_reducer = "REDUCE_SUM"
        group_by_fields      = ["resource.labels.service_name"]
      }

      trigger {
        count = 1
      }
    }
  }

  alert_strategy {
    auto_close = "604800s"
  }
}

resource "google_monitoring_alert_policy" "localized_page" {
  display_name          = "Aesthetic Lab localized production page unavailable"
  combiner              = "OR"
  notification_channels = var.notification_channel_ids

  conditions {
    display_name = "Localized page check fails"
    condition_threshold {
      filter          = "resource.type = \"uptime_url\" AND metric.type = \"monitoring.googleapis.com/uptime_check/check_passed\" AND metric.labels.check_id = \"${google_monitoring_uptime_check_config.localized_page.uptime_check_id}\""
      comparison      = "COMPARISON_LT"
      threshold_value = 1
      duration        = "120s"

      aggregations {
        alignment_period   = "120s"
        per_series_aligner = "ALIGN_NEXT_OLDER"
      }

      trigger {
        count = 1
      }
    }
  }

  alert_strategy {
    auto_close = "604800s"
  }
}

resource "google_monitoring_alert_policy" "latency" {
  display_name          = "Aesthetic Lab production p95 latency"
  combiner              = "OR"
  notification_channels = var.notification_channel_ids

  conditions {
    display_name = "p95 request latency exceeds two seconds"
    condition_threshold {
      filter          = "resource.type = \"cloud_run_revision\" AND resource.labels.service_name = \"${var.production_service_name}\" AND metric.type = \"run.googleapis.com/request_latencies\""
      comparison      = "COMPARISON_GT"
      threshold_value = 2000
      duration        = "300s"

      aggregations {
        alignment_period     = "60s"
        per_series_aligner   = "ALIGN_PERCENTILE_95"
        cross_series_reducer = "REDUCE_MAX"
        group_by_fields      = ["resource.labels.service_name"]
      }

      trigger {
        count = 1
      }
    }
  }

  alert_strategy {
    auto_close = "604800s"
  }
}

resource "google_monitoring_alert_policy" "instance_saturation" {
  display_name          = "Aesthetic Lab production instance saturation"
  combiner              = "OR"
  notification_channels = var.notification_channel_ids

  conditions {
    display_name = "Active instances at configured maximum"
    condition_threshold {
      filter          = "resource.type = \"cloud_run_revision\" AND resource.labels.service_name = \"${var.production_service_name}\" AND metric.type = \"run.googleapis.com/container/instance_count\" AND metric.labels.state = \"active\""
      comparison      = "COMPARISON_GE"
      threshold_value = var.production_max_instances
      duration        = "300s"

      aggregations {
        alignment_period     = "60s"
        per_series_aligner   = "ALIGN_MAX"
        cross_series_reducer = "REDUCE_SUM"
        group_by_fields      = ["resource.labels.service_name"]
      }

      trigger {
        count = 1
      }
    }
  }

  alert_strategy {
    auto_close = "604800s"
  }
}

resource "google_monitoring_alert_policy" "runtime_failure" {
  display_name          = "Aesthetic Lab production runtime failure"
  combiner              = "OR"
  notification_channels = var.notification_channel_ids

  conditions {
    display_name = "Cloud Run reports memory, startup, or termination failure"
    condition_matched_log {
      filter = "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"${var.production_service_name}\" AND (textPayload:\"memory limit\" OR textPayload:\"failed to start and listen\" OR textPayload:\"container instance was terminated\" OR jsonPayload.message:\"memory limit\")"
    }
  }

  alert_strategy {
    notification_rate_limit {
      period = "300s"
    }
    auto_close = "604800s"
  }
}

resource "google_monitoring_alert_policy" "supabase_failure" {
  display_name          = "Aesthetic Lab production Supabase loader failure"
  combiner              = "OR"
  notification_channels = var.notification_channel_ids

  conditions {
    display_name = "Application reports supabase_fetch_failed"
    condition_matched_log {
      filter = "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"${var.production_service_name}\" AND jsonPayload.message=\"supabase_fetch_failed\""
    }
  }

  alert_strategy {
    notification_rate_limit {
      period = "300s"
    }
    auto_close = "604800s"
  }
}
