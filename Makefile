.PHONY: blog
blog: 
	rm -rf build/ && cd client && REACT_APP_MOBILE_TEST=true npm run build && cd ../ && go run application.go

.PHONY: server
server:
	cd server && go run main.go

.PHONY: www
www:
	cd www && yarn dev

.PHONY: code 
code:
	code blog.code-workspace

.PHONY: image
image:
	docker build -t gcr.io/blog-121419/blog:v$(version) . && docker push gcr.io/blog-121419/blog:v$(version)

.PHONY: tfplan
tfplan:
	cd terraform && terraform plan

.PHONY: tfapply
tfapply:
	cd terraform && terraform apply

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
	- mkdir -p $HOME/docker/volumes/postgres
	- docker run --rm --name pg-docker -e POSTGRES_PASSWORD=docker -d -p 5432:5432 -v $HOME/docker/volumes/postgres:/var/lib/postgresql/data postgres
	chmod +x ./server/storage/sql/init/init.sh
	 /bin/bash ./server/storage/sql/init/init.sh