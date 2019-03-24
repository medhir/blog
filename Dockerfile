# Golang Version
FROM golang:1.11.5-alpine
# Set working directory
WORKDIR /blog
# Copy the current directory contents into the container
COPY . /blog