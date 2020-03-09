.PHONY: blog
blog: 
	rm -rf build/ && cd client && REACT_APP_MOBILE_TEST=true npm run build && cd ../ && go run application.go

.PHONY: client
client:
	cd client && npm run start

.PHONY: code 
code:
	code blog.code-workspace

.PHONY: image
image:
	docker build -t gcr.io/blog-121419/blog:v$(version) . && docker push gcr.io/blog-121419/blog:v$(version)

.PHONY: tfinit
tfinit: 
	cd terraform && terraform init

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