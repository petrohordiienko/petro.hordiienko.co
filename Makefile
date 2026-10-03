MODE ?= prod

BASE_DIR ?= $(CURDIR)

DOCKER_COMPOSE_FILE     ?= $(BASE_DIR)/docker-compose.yml
DOCKER_COMPOSE_DEV_FILE ?= $(BASE_DIR)/docker-compose.dev.yml

COMPOSE_FILES = -f $(DOCKER_COMPOSE_FILE)
ifeq ($(MODE),dev)
COMPOSE_FILES += -f $(DOCKER_COMPOSE_DEV_FILE)
endif

COMPOSE = docker compose $(COMPOSE_FILES)

help: Makefile
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)


.PHONY: dc-build dc-up-d dc-build-up-d dc-down dc-down-v

dc-build: ## Compose build the service image(s)
	@$(COMPOSE) -f ${DOCKER_COMPOSE_FILE} build ${APPS}

dc-up-d: ## Compose run the applications as a daemon
	@$(COMPOSE) -f ${DOCKER_COMPOSE_FILE} up -d ${APPS}

dc-build-up-d: dc-build dc-up-d

dc-down: ## Compose down services
	@$(COMPOSE) -f ${DOCKER_COMPOSE_FILE} down

dc-down-v: ## Compose down services and remove volumes
	@$(COMPOSE) -f ${DOCKER_COMPOSE_FILE} down -v

