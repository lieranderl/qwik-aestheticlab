output "master_ip" {
  description = "The public IP address of the Kubernetes master node"
  value       = hcloud_server.k8s_master.ipv4_address
}

output "master_name" {
  description = "The name of the Kubernetes master node"
  value       = hcloud_server.k8s_master.name
}

output "server_type" {
  description = "The server type used for the Kubernetes master node"
  value       = hcloud_server.k8s_master.server_type
}

output "location" {
  description = "The location of the Kubernetes master node"
  value       = hcloud_server.k8s_master.location
}
