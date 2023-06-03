# Define system python interpreter. used only to create virtual environment
PY = python3
VENV = .venv
BIN=$(VENV)/bin

# General AWS Variables
REGION=us-west-2

# Amplify Variables
AMPLIFY_APP_ID=d1dr5v5g7cfiko
BRANCH_NAME=main

# ECR Variables
ECR_REGISTRY=775627766428.dkr.ecr.us-west-2.amazonaws.com
ECR_REPOSITORY=houseparty-prod-backend

# ECS Variables
TASK_DEFINITION_NAME=houseparty-prod-task-definition
CLUSTER_NAME=houseparty-prod-ecs-cluster
SERVICE_NAME=houseparty-prod-ecs-service

.PHONY: help

help: ## Describes each Makefile target
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

### Frontend

run-frontend: ## Run frontend web server in developement mode with Docker Compose
	cd frontend; \
	docker-compose up -d --build; \
	cd ../

stop-frontend: ## Stops the frontend web server with Docker Compose
	cd frontend; \
	docker-compose down; \
	cd ../

logs-frontend: ## Prints the last 100 lines of the running Docker container
	cd frontend; \
	docker-compose logs frontend --tail 100;\
	cd ../

deploy-frontend: ## [Requires latest changes to be committed to REMOTE] Manually kick off Amplify Job to build, test, and deploy frontend
	./scripts/deploy_frontend.sh "$(REGION)" "$(AMPLIFY_APP_ID)" "$(BRANCH_NAME)"

deploy-infra-frontend: ## Deploy backend infrastructure
	cd infra/frontend; \
	terraform plan -var-file prod.tfvars; \
	terraform apply -auto-approve -input=false -var-file prod.tfvars; \
	cd ../..

### Backend

$(VENV): backend/requirements.txt ## Create .venv Python3 virtual environment
	$(PY) -m venv $(VENV)
	$(BIN)/pip install --upgrade -r backend/requirements.txt
	$(BIN)/pip install --upgrade pip
	touch $(VENV)

run-backend: ## Runs the backend web server and postgres database with Docker Compose
	cd backend; \
	docker-compose up -d --build; \
	cd ../

stop-backend: ## Stops the backend web server and postgres database with Docker Compose (NOTE: Adding -v will delete the database)
	cd backend; \
	docker-compose down; \
	cd ../

logs-backend: ## Prints the last 100 lines of the running Docker container
	cd backend; \
	docker-compose logs web --tail 100;\
	cd ../

build-backend: ## Builds a Docker image of backend webserver
	cd backend; \
	docker build -t $(ECR_REPOSITORY) .; \
	cd ../

deploy-backend: build-backend ## Manually push LOCALLY built docker image to ECR, update task definition and deploy backend webserver to ECS
	./scripts/deploy_backend.sh "$(REGION)" "$(ECR_REGISTRY)" "$(ECR_REPOSITORY)" "$(TASK_DEFINITION_NAME)" "$(CLUSTER_NAME)" "$(SERVICE_NAME)"

deploy-infra-backend: ## Deploy backend infrastructure
	cd infra/backend; \
	terraform plan -var-file prod.tfvars; \
	terraform apply -auto-approve -input=false -var-file prod.tfvars; \
	cd ../..

open-backend-web-shell: ## Opens a shell on an ECS Task running the backend webserver
	./scripts/open_backend_web_shell.sh "$(REGION)" "$(CLUSTER_NAME)" "$(SERVICE_NAME)"
