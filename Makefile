# Define system python interpreter. used only to create virtual environment
PY = python3
VENV = .venv
BIN=$(VENV)/bin

.PHONY: help

help: ## Describes each Makefile target
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

$(VENV): requirements.txt ## Create .venv Python3 virtual environment
	$(PY) -m venv $(VENV)
	$(BIN)/pip install --upgrade -r requirements.txt
	touch $(VENV)

run-frontend-dev: ## Run frontend web server in developement mode
	cd frontend; \
	npm start; \
	cd ../

run-backend-dev: $(VENV) ## Run backend web server in developement mode
	cd backend; \
	../$(BIN)/python manage.py migrate; \
	../$(BIN)/python manage.py makemigrations; \
	../$(BIN)/python manage.py runserver; \
	cd ../

build-frontend: ## Builds the frontend and moves output to the backend folder
	cd frontend; \
	npm run relocate; \
	cd ../

run-monolith-dev: build-frontend run-backend-dev ## Runs the backend webserver with built frontend code colocated
