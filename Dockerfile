# Server build step
FROM registry.medhir.com/medhir/blog-go-vips/master:latest AS go-build-env
# Set working directory, copy contents
WORKDIR /go/src/github.com/medhir/blog/
COPY . .
# Get external dependencies
RUN go get -d -v

# Go application build step
RUN CGO_ENABLED=1 GOARCH=amd64 GOOS=linux go build -o app .

# Client build step
FROM node:8.15.0 AS node-build-env
# Install node modules
COPY ./client/ /client/
RUN cd client/ && npm install && npm run build

# Final build stage
FROM registry.medhir.com/medhir/blog-alpine-vips/master:latest
# Copy Go binary
COPY --from=go-build-env /go/src/github.com/medhir/blog/app ./
# Copy Client build artifacts
COPY --from=node-build-env ./build/ ./build/
COPY ./templates/ ./templates/

# CGO config
RUN apk add --no-cache \
  libc6-compat

EXPOSE 9000
CMD ["./app"]