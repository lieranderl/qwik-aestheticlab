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
}

variable "staging_service_name" {
  type    = string
  default = "stage-aestheticlab-web"
}

variable "production_service_name" {
  type    = string
  default = "aestheticlab-web"
}

variable "supabase_url" {
  description = "Public Supabase project URL."
  type        = string
}

variable "supabase_secret_id" {
  description = "Secret Manager secret ID containing the Supabase key."
  type        = string
  default     = "SUPABASE_KEY"
}

variable "supabase_secret_version" {
  description = "Pinned numeric Secret Manager version containing the Supabase key."
  type        = string

  validation {
    condition     = can(regex("^[1-9][0-9]*$", var.supabase_secret_version))
    error_message = "supabase_secret_version must be a positive numeric version."
  }
}

variable "production_uptime_host" {
  description = "Public production hostname checked independently of Cloud Run."
  type        = string
  default     = "aestheticlab.be"
}

variable "github_workload_identity_principals" {
  description = "Exact environment-scoped WIF principals keyed by staging and production, e.g. principal://iam.googleapis.com/projects/NUMBER/locations/global/workloadIdentityPools/POOL/subject/repo:OWNER/REPO:environment:staging."
  type        = map(string)

  validation {
    condition     = length(setsubtract(toset(["staging", "production"]), toset(keys(var.github_workload_identity_principals)))) == 0
    error_message = "Provide staging and production WIF principals."
  }
}

variable "notification_channel_ids" {
  description = "Existing Monitoring notification channel resource names."
  type        = list(string)

  validation {
    condition     = length(var.notification_channel_ids) > 0
    error_message = "Provide at least one Monitoring notification channel."
  }
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
}

variable "container_concurrency" {
  description = "Maximum concurrent requests per instance."
  type        = number
  default     = 40
}
