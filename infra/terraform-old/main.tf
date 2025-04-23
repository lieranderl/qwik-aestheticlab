
resource "hcloud_server" "k8s_master" {
  name        = var.server_name
  image       = var.image
  server_type = var.server_type
  location    = var.location
  ssh_keys    = [var.ssh_key_name]
}

resource "null_resource" "create_inventory_folder" {
  provisioner "local-exec" {
    command = "mkdir -p ../ansible/inventory"
  }
}

resource "local_file" "ansible_inventory" {
  content  = <<-EOT
    [k8s_masters]
    master ansible_host=${hcloud_server.k8s_master.ipv4_address} ansible_user=root ansible_ssh_private_key_file=~/.ssh/ev-server-hetzner ansible_ssh_common_args='-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null'
  EOT
  filename = "../ansible/inventory/hosts.ini"
}

