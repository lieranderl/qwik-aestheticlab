# terraform/variables.tf
variable "hcloud_token" {
  description = "Hetzner Cloud API token"
  type        = string
  sensitive   = true
}

variable "ssh_key_name" {
  description = "Name of the SSH key in Hetzner Cloud"
  type        = string
}

variable "server_type" {
  description = "Hetzner Cloud server type for Kubernetes master"
  type        = string
  default     = "cax11"
}

variable "location" {
  description = "Hetzner Cloud server location"
  type        = string
  default     = "nbg1"
}

variable "kubernetes_version" {
  description = "Kubernetes version to install"
  type        = string
  default     = "1.32"
}

variable "server_name" {
  default = "k8s-master"
}

variable "image" {
  default = "ubuntu-24.04"
}

variable "ansible_user" {
  default = "root"
}

variable "ssh_private_key" {
  default = "~/.ssh/ev-server-hetzner"
}