# Server build step
FROM golang:1.11.5 AS go-build-env
# Set working directory, copy contents
WORKDIR /go/src/github.com/medhir/blog/
COPY . .
# Get external dependencies
RUN go get -d -v
# BIMG config 
RUN apt-get update
RUN apt-get install -y libvips libvips-dev
# Go application build step
RUN CGO_ENABLED=1 GOARCH=amd64 GOOS=linux go build -o app .

# Client build step
FROM node:8.15.0 AS node-build-env
# Install node modules
COPY ./client/ /client/
RUN cd client/ && npm install && npm run build

# Final build stage
FROM alpine
# Copy Go binary
COPY --from=go-build-env /go/src/github.com/medhir/blog/app ./
# Copy Client build artifacts
COPY --from=node-build-env ./build/ ./build/
# BIMG config 
ARG VIPS_VERSION=8.6.4
RUN set -x -o pipefail \
    && wget -O- https://github.com/libvips/libvips/releases/download/v${VIPS_VERSION}/vips-${VIPS_VERSION}.tar.gz | tar xzC /tmp \
    && apk update \
    && apk upgrade \
    && apk add \
    zlib libxml2 glib gobject-introspection \
    libjpeg-turbo libexif lcms2 fftw giflib libpng \
    libwebp orc tiff poppler-glib librsvg libgsf openexr \
    && apk add --virtual vips-dependencies build-base \
    zlib-dev libxml2-dev glib-dev gobject-introspection-dev \
    libjpeg-turbo-dev libexif-dev lcms2-dev fftw-dev giflib-dev libpng-dev \
    libwebp-dev orc-dev tiff-dev poppler-dev librsvg-dev libgsf-dev openexr-dev \
    py-gobject3-dev \
    && cd /tmp/vips-${VIPS_VERSION} \
    && ./configure --prefix=/usr \
                   --disable-static \
                   --disable-dependency-tracking \
                   --enable-silent-rules \
                   --enable-pyvips8 \
    && make -s install-strip \
    && cd $OLDPWD \
    && rm -rf /tmp/vips-${VIPS_VERSION} \
    && apk del --purge vips-dependencies \
    && rm -rf /var/cache/apk/*
# CGO config
RUN apk add --no-cache \
        libc6-compat
# CA Certs 
RUN apk --no-cache add ca-certificates
# Set host port
ENV PORT="80"
EXPOSE 80
CMD ["./app"]