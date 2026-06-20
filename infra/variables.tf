variable "project_id" {
  description = "Google Cloud project ID."
  type        = string
}

variable "region" {
  description = "Region for Artifact Registry and Cloud Run."
  type        = string
  default     = "europe-west1"
}

variable "artifact_registry_repository" {
  description = "Artifact Registry Docker repository ID."
  type        = string
  default     = "aestheticlab"
}

variable "image_name" {
  description = "Container image name within the repository."
  type        = string
  default     = "web"
}

variable "initial_image" {
  description = "Bootstrapping image; CI owns subsequent image updates by digest."
  type        = string

  validation {
    condition     = can(regex("@sha256:[0-9a-f]{64}$", var.initial_image))
    error_message = "initial_image must use an immutable sha256 digest."
  }
}

variable "staging_service_name" {
  type    = string
  default = "stage-aestheticlab-web"
}

variable "production_service_name" {
  type    = string
  default = "aestheticlab-web"
}

variable "staging_supabase_url" {
  description = "Staging Supabase project URL."
  type        = string

  validation {
    condition     = can(regex("^https://", var.staging_supabase_url))
    error_message = "staging_supabase_url must use HTTPS."
  }
}

variable "production_supabase_url" {
  description = "Production Supabase project URL."
  type        = string

  validation {
    condition     = can(regex("^https://", var.production_supabase_url))
    error_message = "production_supabase_url must use HTTPS."
  }
}

variable "staging_supabase_secret_id" {
  description = "Secret Manager secret ID containing the staging publishable/anon key."
  type        = string
  default     = "SUPABASE_KEY_STAGING"
}

variable "production_supabase_secret_id" {
  description = "Secret Manager secret ID containing the production publishable/anon key."
  type        = string
  default     = "SUPABASE_KEY_PRODUCTION"
}

variable "staging_supabase_secret_version" {
  description = "Pinned numeric Secret Manager version containing the staging publishable/anon key."
  type        = string

  validation {
    condition     = can(regex("^[1-9][0-9]*$", var.staging_supabase_secret_version))
    error_message = "staging_supabase_secret_version must be a positive numeric version."
  }
}

variable "production_supabase_secret_version" {
  description = "Pinned numeric Secret Manager version containing the production publishable/anon key."
  type        = string

  validation {
    condition     = can(regex("^[1-9][0-9]*$", var.production_supabase_secret_version))
    error_message = "production_supabase_secret_version must be a positive numeric version."
  }
}

variable "production_uptime_host" {
  description = "Public production hostname checked independently of Cloud Run."
  type        = string
  default     = "aestheticlab.be"
}

variable "github_repository" {
  description = "GitHub repository allowed to federate into the dedicated pool."
  type        = string
  default     = "lieranderl/qwik-aestheticlab"
}

variable "github_repository_owner_id" {
  description = "Immutable numeric GitHub owner ID used in the WIF provider condition."
  type        = string
  default     = "19622412"
}

variable "notification_email" {
  description = "Email address for the managed production alert channel."
  type        = string

  validation {
    condition     = can(regex("^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$", var.notification_email))
    error_message = "notification_email must be a valid email address."
  }
}

variable "additional_notification_channel_ids" {
  description = "Optional existing Monitoring notification channel resource names."
  type        = list(string)
  default     = []
}

variable "allow_public_access" {
  description = "Grant unauthenticated Cloud Run invocation."
  type        = bool
  default     = true
}

variable "deletion_protection" {
  description = "Protect Cloud Run services from accidental deletion after bootstrap."
  type        = bool
  default     = true
}

variable "staging_min_instances" {
  type    = number
  default = 0
}

variable "staging_max_instances" {
  type    = number
  default = 2
}

variable "production_min_instances" {
  type    = number
  default = 1
}

variable "production_max_instances" {
  type    = number
  default = 3

  validation {
    condition     = var.production_max_instances >= 1
    error_message = "production_max_instances must be at least 1."
  }
}

variable "container_concurrency" {
  description = "Maximum concurrent requests per instance."
  type        = number
  default     = 40
}
