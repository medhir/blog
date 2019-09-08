.PHONY: blog
blog: 
	rm -rf build/ && cd client && REACT_APP_MOBILE_TEST=true npm run build && cd ../ && go run application.go

.PHONY: webapp
webapp:
	cd client && npm run start

.PHONY: code 
code:
	code blog.code-workspace

.PHONY: image
image:
	docker build -t medhir/blog:latest .