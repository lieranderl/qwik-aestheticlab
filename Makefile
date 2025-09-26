SHELL := /bin/bash

# Required environment variables
REQUIRED_ENV_VARS := SUPABASE_URL SUPABASE_KEY

# Default tag if not set externally
TAG ?= latest

# Helper function to check env vars
define check-env
	@for var in $(REQUIRED_ENV_VARS); do \
		if [ -z "$${!var}" ]; then \
			echo "❌ Missing required environment variable: $$var"; \
			exit 1; \
		else \
			echo "✅ $$var is set"; \
		fi \
	done
endef

# Help target (default)
.PHONY: help
help: ## Show available targets and usage
	@echo "Usage: make <target> [TAG=your-tag]"
	@echo
	@echo "Targets:"
	@grep -E '^[a-zA-Z0-9._-]+:.*?##' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?##"}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: docker-build-push
docker-build-push: ## Build and push Docker image to DockerHub (requires TAG)
	$(call check-env)
	docker buildx build \
		--platform linux/amd64 \
		--provenance=false \
		--sbom=false \
		-t furlingene/qwik-aesthetic:$(TAG) \
		--push .

.PHONY: gcloud-deploy
gcloud-deploy: ## Deploy image to Google Cloud Run (requires TAG)
	$(call check-env)
	gcloud run deploy aestheticlab-web \
		--image=furlingene/qwik-aesthetic:$(TAG) \
		--region=europe-west1 \
		--project=nail-lab-449417
