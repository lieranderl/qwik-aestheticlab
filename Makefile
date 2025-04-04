# Check environment variables
ifndef SUPABASE_URL
$(error SUPABASE_URL is not set)
endif
ifndef SUPABASE_KEY
$(error SUPABASE_KEY is not set)
endif
ifndef API_TOKEN
$(error API_TOKEN is not set)
endif
ifndef WEBHOOK
$(error WEBHOOK is not set)
endif
ifndef N8N_ENCRYPTION_KEY
$(error N8N_ENCRYPTION_KEY is not set)
endif
ifndef GENERIC_TIMEZONE
$(error GENERIC_TIMEZONE is not set)
endif
ifndef DOMAIN_NAME
$(error DOMAIN_NAME is not set)
endif
ifndef KUBECONFIG
$(error KUBECONFIG is not set)
endif
ifndef TAG
$(error TAG is not set)
endif
# Check if the command "helm" is available
ifeq (, $(shell which helm))
$(error "The 'helm' command is not available. Please install Helm.")
endif


# Default target
.PHONY: all
all: init apply delay playbook build push helm-upgrade

delay:
	sleep 25 

# Build the Docker image using nerdctl
.PHONY: build
build:
	@echo "Building Docker image for ARM64..."
	bunx @biomejs/biome check --fix
	docker buildx create --use
	docker buildx build --platform linux/arm64 --load -t docker.io/furlingene/qwik-aesthetic:$(TAG) -f Dockerfile --build-arg SUPABASE_URL=$(SUPABASE_URL) --build-arg SUPABASE_KEY=$(SUPABASE_KEY) .

# Push the Docker image to Docker Hub
.PHONY: push
push:
	@echo "Pushing Docker image to Docker Hub..."
	docker push docker.io/furlingene/qwik-aesthetic:$(TAG)

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
	# kubectl rollout restart deployment/aesthetic-app-n8n


# Variables
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


# Run Ansible playbook
.PHONY: playbook
playbook:
	@cd $(ANSIBLE_DIR) && \
		ansible-playbook -i inventory/hosts.ini playbook.yaml


help:
	@echo "Available commands:"
	@echo "  make all       		- Init, Apply, configure, build, push and upgrade Helm chart"
	@echo "  make build     		- Build the Docker image"
	@echo "  make push      	 	- Push the Docker image to Docker Hub"
	@echo "  make helm-upgrade      - Run the Helm upgrade"
	@echo "  make init              - Initialize Terraform"
	@echo "  make plan              - Show Terraform execution plan"
	@echo "  make apply             - Create infrastructure"
	@echo "  make destroy           - Terminate infrastructure"
	@echo "  make clean             - Remove Terraform state files"
	@echo "  make help              - Show this help message"
	@echo "  make playbook          - Run Ansible playbook"
