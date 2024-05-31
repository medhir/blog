FROM golang:1.22 AS builder
ENV GO111MODULE=on
WORKDIR /server
RUN --mount=type=secret,id=GITHUB_TOKEN \
    git config --global url."https://$(cat /run/secrets/GITHUB_TOKEN):x-oauth-basic@github.com/".insteadOf "https://github.com/"
COPY go.mod .
COPY go.sum .
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOARCH=amd64 GOOS=linux go build -o app .

FROM alpine
COPY --from=builder /server ./
RUN apk add --no-cache ca-certificates && update-ca-certificates
EXPOSE 9000
CMD ["./app"]