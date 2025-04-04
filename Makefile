# Ensure that Make uses bash
SHELL := /bin/bash

# Check environment variables
check-env-vars:
	@echo "Checking environment variables..."
	@for var in SUPABASE_URL SUPABASE_KEY API_TOKEN WEBHOOK N8N_ENCRYPTION_KEY GENERIC_TIMEZONE DOMAIN_NAME KUBECONFIG EMAIL TAG; do \
		if [ -z "$${!var}" ]; then \
			echo "$${var} is not set."; \
			exit 1; \
		fi \
	done

# Check if the command "helm" is available
check-helm:
	@which helm > /dev/null || (echo "'helm' command is not available. Please install Helm." && exit 1)

# Default target
.PHONY: all
all: check-env-vars check-helm init apply delay playbook build push helm-upgrade

# Delay execution to allow for resources to settle (useful for async tasks)
.PHONY: delay
delay:
	@sleep 25 

# Build the Docker image using nerdctl
.PHONY: build
build:
	@echo "Building Docker image for ARM64..."
	@bunx @biomejs/biome check --fix
	@docker buildx create --use
	@docker buildx build --platform linux/arm64 --load -t docker.io/furlingene/qwik-aesthetic:$(TAG) -f Dockerfile --build-arg SUPABASE_URL=$(SUPABASE_URL) --build-arg SUPABASE_KEY=$(SUPABASE_KEY) .

# Push the Docker image to Docker Hub
.PHONY: push
push:
	@echo "Pushing Docker image to Docker Hub..."
	@docker push docker.io/furlingene/qwik-aesthetic:$(TAG)

# Run the Helm upgrade
.PHONY: helm-upgrade
helm-upgrade:
	@echo "Running Helm upgrade..."
	helm ls
	helm upgrade -i aesthetic-app ./infra/helm-chart \
	--set bun.env.API_TOKEN="$(API_TOKEN)" \
    --set bun.env.SUPABASE_URL=$(SUPABASE_URL) \
    --set bun.env.SUPABASE_KEY=$(SUPABASE_KEY) \
	--set bun.env.WEBHOOK=$(WEBHOOK) \
    --set n8n.env.N8N_ENCRYPTION_KEY=$(N8N_ENCRYPTION_KEY) \
    --set n8n.env.GENERIC_TIMEZONE=$(GENERIC_TIMEZONE) \
    --set domain=$(DOMAIN_NAME) \
	--set bun.tag=$(TAG) \
	--set email=$(EMAIL)
	@echo "Helm upgrade completed."

# Terraform variables
TERRAFORM_DIR := infra/terraform
ANSIBLE_DIR := infra/ansible

# Initialize Terraform
.PHONY: init
init:
	@cd $(TERRAFORM_DIR) && terraform init

# Plan Terraform infrastructure
.PHONY: plan
plan: init
	@cd $(TERRAFORM_DIR) && terraform plan

# Apply Terraform infrastructure
.PHONY: apply
apply: init
	@cd $(TERRAFORM_DIR) && terraform apply -auto-approve

# Destroy Terraform infrastructure
.PHONY: destroy
destroy:
	@cd $(TERRAFORM_DIR) && terraform destroy -auto-approve

# Clean up Terraform state and temporary files
.PHONY: clean
clean:
	@cd $(TERRAFORM_DIR) && \
		rm -f terraform.tfstate terraform.tfstate.backup && \
		rm -rf .terraform .terraform.lock.hcl
	@rm -f $(ANSIBLE_DIR)/inventory/hosts

# Run Ansible playbooks
.PHONY: playbook
playbook:
	@cd $(ANSIBLE_DIR) && \
		ansible-playbook -i inventory/hosts.ini playbook.yaml

# Run a specific role with tags
.PHONY: playbook-role
playbook-role:
	@cd $(ANSIBLE_DIR) && \
		ansible-playbook -i inventory/hosts.ini playbook.yaml --tags $(ROLE)

# Help target to show available commands
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make all               - Check env vars, initialize, apply, build, push and upgrade Helm chart"
	@echo "  make build             - Build the Docker image"
	@echo "  make push              - Push the Docker image to Docker Hub"
	@echo "  make helm-upgrade      - Run the Helm upgrade"
	@echo "  make init              - Initialize Terraform"
	@echo "  make plan              - Show Terraform execution plan"
	@echo "  make apply             - Create infrastructure"
	@echo "  make destroy           - Terminate infrastructure"
	@echo "  make clean             - Remove Terraform state files"
	@echo "  make playbook          - Run Ansible playbook"
	@echo "  make playbook-role     - Run Ansible playbook with specific role. Use ROLE=role_name"
	@echo "  make help              - Show this help message"
	@echo "  make check-env-vars    - Check environment variables"
	@echo "  make check-deployment  - Check Kubernetes deployment"
	@echo "  make start-dashboard   - Start Kubernetes dashboard"

# Check k8s deplpoyment
.PHONY: check-deployment
check-deployment:
	@echo "Checking k8s deployment..."
	@kubectl get pods -A
	@kubectl get svc -A
	@kubectl get ingressroutes -A
	@echo "k8s deployment check completed."

# Start k8s dashboard
.PHONY: start-dashboard
start-dashboard:
	@echo "Generating Kubernetes dashboard token..."
	@kubectl create token default -n kube-system 
	@echo "Starting Kubernetes dashboard..."
	@kubectl -n kube-system port-forward svc/kubernetes-dashboard 8443:443