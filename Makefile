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
ifndef API_BASE_URL
$(error API_BASE_URL is not set)
endif
ifndef N8N_HOST
$(error N8N_HOST is not set)
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
ifndef TAG
$(error TAG is not set)
endif
# Check if the command "helm" is available
ifeq (, $(shell which helm))
$(error "The 'helm' command is not available. Please install Helm.")
endif

# Check if the command "nerdctl" is available
ifeq (, $(shell which nerdctl))
$(error "The 'nerdctl' command is not available. Please install Nerdctl.")
endif

# Check if the command "biome" is available
ifeq (, $(shell which biome))
$(error "The 'biome' command is not available. Please install Biome.")
endif



# Default target
.PHONY: all
all: build push helm-upgrade

# Build the Docker image using nerdctl
.PHONY: build
build:
	@echo "Building Docker image..."
	biome check --fix
	nerdctl build -t docker.io/furlingene/qwik-aesthetic:$(TAG) -f Dockerfile \
	  --build-arg SUPABASE_URL=$(SUPABASE_URL) \
	  --build-arg SUPABASE_KEY=$(SUPABASE_KEY) .


# Push the Docker image to Docker Hub
.PHONY: push
push:
	@echo "Pushing Docker image to Docker Hub..."
	nerdctl push docker.io/furlingene/qwik-aesthetic:$(TAG)

# Run the Helm upgrade
.PHONY: helm-upgrade
helm-upgrade:
	@echo "Running Helm upgrade..."
	helm ls
	helm upgrade -i aesthetic-app ./helm-chart \
	--set bun.env.API_TOKEN="$(API_TOKEN)" \
    --set bun.env.SUPABASE_URL=$(SUPABASE_URL) \
    --set bun.env.SUPABASE_KEY=$(SUPABASE_KEY) \
    --set n8n.env.N8N_HOST=$(N8N_HOST) \
    --set bun.env.API_BASE_URL=$(API_BASE_URL) \
    --set n8n.env.N8N_ENCRYPTION_KEY=$(N8N_ENCRYPTION_KEY) \
    --set n8n.env.GENERIC_TIMEZONE=$(GENERIC_TIMEZONE) \
    --set n8n.env.DOMAIN_NAME=$(DOMAIN_NAME)
	kubectl rollout restart deployment/aesthetic-app-n8n

help:
	@echo "Available commands:"
	@echo "  make all       - Build, push and upgrade Helm chart"
	@echo "  make build     - Build the Docker image"
	@echo "  make push      - Push the Docker image to Docker Hub"
	@echo "  make helm-upgrade     - Run the Helm upgrade"
