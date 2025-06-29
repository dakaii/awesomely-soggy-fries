.PHONY: help install dev build start stop clean logs test test-parallel migrate migrate-create seed
.PHONY: local start-local test-local db-up db-down db-clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Development Commands:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	npm install

# Docker Development
dev: ## Start development server with Docker
	docker compose up --build

build: ## Build the application
	docker compose build

start: ## Start the application with Docker
	docker compose up -d

stop: ## Stop Docker containers
	docker compose down

clean: ## Clean up containers and volumes
	docker compose down -v --remove-orphans
	docker system prune -f

logs: ## Show application logs
	docker compose logs -f app

# Local Development (app local, db in Docker)
local: db-up ## Start local development (database in Docker)
	@echo "🚀 Database running in Docker"
	@echo "🔧 Start app with: make start-local"
	@echo "🧪 Run tests with: make test-local"

start-local: ## Start application locally
	npm run start:local

test-local: ## Run tests locally
	npm run test:local

# Database Management
db-up: ## Start development database in Docker
	docker compose up -d db

db-down: ## Stop database containers
	docker compose down

db-clean: ## Remove database volumes
	docker compose down -v

# Testing
test: ## Run tests in Docker
	docker compose -f docker-compose.test.yml run --rm -T test-app npm test
	docker compose -f docker-compose.test.yml down -v

test-parallel: ## Run tests in parallel in Docker
	docker compose -f docker-compose.test.yml run --rm -T -e TEST_PARALLEL=true test-app npm run test:parallel
	docker compose -f docker-compose.test.yml down -v

# Migrations
migrate: ## Run database migrations
	npm run migration:up

migrate-create: ## Create a new migration
	npm run migration:create

seed: ## Run database seeds (if available)
	npm run seed || echo "No seed command available"
