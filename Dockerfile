# Server build step
FROM golang:1.11.5 AS go-build-env
# Set working directory
COPY . $GOPATH/src/github.com/medhir/blog/
WORKDIR $GOPATH/src/github.com/medhir/blog/

# allow private repo pull
# RUN git config --global url."https://ceb1c146c83e735aa5e2e5b8822484d00cb93e4d:x-oauth-basic@github.com/".insteadOf "https://github.com/"

# Copy the current directory contents into the container
RUN go get -d -v
RUN go build -o blog

# Client build step
FROM node:8.15.0 AS node-build-env
WORKDIR /client
# Install node modules
COPY ./client /client
RUN cd client/ && npm install && npm run build


# Final stage
FROM alpine
WORKDIR /blog
COPY --from=node-build-env /client/build /blog/build
COPY --from=go-build-env /goapp/app /blog/
ENTRYPOINT ./app