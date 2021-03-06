NAME := personal-archive
VERSION :=  $(shell cat VERSION.txt)

.PHONY: deps
deps:
	@echo "\n\033[1;33m+ $@\033[0m"
	@go mod download

.PHONY: run-local
run-local:
	@echo "\n\033[1;33m+ $@\033[0m"
	@ENV=local go run --tags "fts5" ./main.go

.PHONY: run-prod
run-prod:
	@echo "\n\033[1;33m+ $@\033[0m"
	@mkdir -p ~/.personal-archive
	@docker run -td -v ~/.personal-archive:/data -p 1121:1121 --name $(NAME) lastiverse/$(NAME):$(VERSION)

.PHONY: run-webui
run-webui:
	@echo "\n\033[1;33m+ $@\033[0m"
	@cd webui && yarn start

.PHONY: build
build: clean test
	@echo "\n\033[1;33m+ $@\033[0m"
	@env GOOS=linux GOARCH=amd64 CGO_ENABLED=1 go build --tags "fts5" -v $(GO_LDFLAGS) -o out/$(NAME) ./main.go

.PHONY: build-webui
build-webui:
	@echo "\n\033[1;33m+ $@\033[0m"
	@cd webui && yarn && yarn build

.PHONY: build-container
build-container:
	@echo "\n\033[1;33m+ $@\033[0m"
	@docker build -t lastiverse/$(NAME):$(VERSION) .
	@docker tag lastiverse/$(NAME):$(VERSION) lastiverse/$(NAME):latest

.PHONY: push-container
push-container:
	@echo "\n\033[1;33m+ $@\033[0m"
	@docker push lastiverse/$(NAME):$(VERSION)
	@docker push lastiverse/$(NAME):latest
	
.PHONY: tidy
tidy:
	@echo "\n\033[1;33m+ $@\033[0m"
	@go mod verify
	@go mod tidy
	@if ! git diff --quiet go.mod go.sum; then \
		echo "please run go mod tidy and check in changes"; \
		exit 1;\
	fi

.PHONY: clean
clean:
	@echo "\n\033[1;33m+ $@\033[0m"
	@rm -f out/*

.PHONY: test
test:
	@echo "\n\033[1;33m+ $@\033[0m"
	@go test ./... --short

