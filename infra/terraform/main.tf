
resource "hcloud_server" "k8s_master" {
  name        = "k8s-master"
  image       = "ubuntu-24.04"
  server_type = var.server_type
  location    = var.location
  ssh_keys    = [var.ssh_key_name]
}

resource "local_file" "ansible_inventory" {
  content  = <<-EOT
    [k8s_masters]
    master ansible_host=${hcloud_server.k8s_master.ipv4_address} ansible_user=root ansible_ssh_private_key_file=~/.ssh/ev-server-hetzner ansible_ssh_common_args='-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null'
  EOT
  filename = "../ansible/inventory/hosts.ini"
}
