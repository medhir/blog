.PHONY: local
local:
	  osascript \
    -e 'tell application "iTerm2" to tell current window to set newWindow to (create tab with default profile)'\
    -e "tell application \"iTerm2\" to tell current session of newWindow to write text \"cd ~/Documents/code/blog && make server\""\
		-e 'tell application "iTerm2" to tell current window to set newWindow to (create tab with default profile)'\
    -e "tell application \"iTerm2\" to tell current session of newWindow to write text \"cd ~/Documents/code/blog && make www\""

.PHONY: blog
blog: 
	rm -rf build/ && cd client && REACT_APP_MOBILE_TEST=true npm run build && cd ../ && go run application.go

.PHONY: server
server:
	cd server && air

.PHONY: www
www:
	cd www && yarn dev

.PHONY: code 
code:
	code blog.code-workspace

.PHONY: podshell
podshell :
	kubectl exec -it $(name) -- sh

.PHONY: remove-evicted
remove-evicted:
	kubectl delete pods --field-selector=status.phase!=Running

.PHONY: mocks
mocks:
	cd server && mockery -all -inpkg

.PHONY: init-db
init-db:
	docker pull postgres:9.6
	- mkdir -p ${HOME}/docker/volumes/postgres
	- docker run --rm --name pg-docker -e POSTGRES_PASSWORD=docker -d -p 5432:5432 -v ${HOME}/docker/volumes/postgres:/var/lib/postgresql/data postgres
	sleep 8
	psql -h localhost -U postgres -d postgres < ${PWD}/server/storage/sql/init/schema.sql

.PHONY: start-db
start-db:
	docker run --rm --name pg-docker -e POSTGRES_PASSWORD=docker -d -p 5432:5432 -v ${HOME}/docker/volumes/postgres:/var/lib/postgresql/data postgres

.PHONY: migration
migration:
	migrate create -ext sql -dir server/storage/sql/migrations -seq $(name)

.PHONY: migrate-up-local
migrate-up-local:
	migrate -source file://server/controllers/storage/sql/migrations -database postgres://postgres:docker@localhost:5432/medhir-com?sslmode=disable up
