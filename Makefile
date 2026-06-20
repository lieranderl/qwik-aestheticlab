SHELL := /bin/bash

# Container and Cloud Run destination. Override any value per environment.
GCP_PROJECT ?= nail-lab-449417
GCP_REGION ?= europe-west1
AR_REPOSITORY ?= aestheticlab
IMAGE_NAME ?= web
IMAGE ?= $(GCP_REGION)-docker.pkg.dev/$(GCP_PROJECT)/$(AR_REPOSITORY)/$(IMAGE_NAME)
SERVICE ?= aestheticlab-web

define check-tag
	@if [ -z "$(TAG)" ]; then \
		echo "TAG is required (for example: make $@ TAG=$$(git rev-parse --short HEAD))"; \
		exit 1; \
	fi
endef

define check-digest
	@case "$(DIGEST)" in \
		sha256:[0-9a-f][0-9a-f]*) ;; \
		*) echo "DIGEST must be an immutable sha256:<digest> value"; exit 1 ;; \
	esac
endef

define check-revision
	@if [ -z "$(REVISION)" ]; then \
		echo "REVISION is required"; \
		exit 1; \
	fi
endef

# Help target (default)
.PHONY: help
help: ## Show available targets and usage
	@echo "Usage: make <target> [TAG=your-tag]"
	@echo
	@echo "Targets:"
	@grep -E '^[a-zA-Z1-9._-]+:.*?##' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?##"}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: dev
dev: ## Run the development server
	bun run dev

.PHONY: build
build: ## Build the project for production
	bun run build

.PHONY: lint
lint: ## Run linting and formatting (biome)
	bun run biome

.PHONY: clean
clean: ## Remove build artifacts and node_modules
	rm -rf dist server node_modules
	bun install

.PHONY: docker-build-push
docker-build-push: ## Build, attest, and push image to Artifact Registry (requires TAG)
	$(call check-tag)
	docker buildx build \
		--platform linux/amd64 \
		--provenance=mode=max \
		--sbom=true \
		-t $(IMAGE):$(TAG) \
		--push .

.PHONY: gcloud-deploy-candidate
gcloud-deploy-candidate: ## Deploy an immutable Cloud Run candidate without traffic (requires DIGEST)
	$(call check-digest)
	gcloud run deploy $(SERVICE) \
		--image=$(IMAGE)@$(DIGEST) \
		--no-traffic \
		--region=$(GCP_REGION) \
		--project=$(GCP_PROJECT)

.PHONY: gcloud-promote
gcloud-promote: ## Promote a verified Cloud Run revision (requires REVISION)
	$(call check-revision)
	gcloud run services update-traffic $(SERVICE) \
		--to-revisions=$(REVISION)=100 \
		--region=$(GCP_REGION) \
		--project=$(GCP_PROJECT)
