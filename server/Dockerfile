FROM golang:1.14.2 AS builder
ENV GO111MODULE=on
WORKDIR /server
COPY go.mod .
COPY go.sum .
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOARCH=amd64 GOOS=linux go build -o app .

FROM alpine
COPY --from=builder /server/app ./
RUN apk add --no-cache ca-certificates && update-ca-certificates
EXPOSE 9000
CMD ["./app"]