FROM mhart/alpine-node:12 AS builder
WORKDIR /www
COPY package.json yarn.lock ./
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
RUN yarn install
COPY . .
RUN yarn build

FROM mhart/alpine-node:12
ENV ENVIRONMENT=""
WORKDIR /www
COPY --from=builder /www .
EXPOSE 3000
ENTRYPOINT ENV=$ENVIRONMENT ./node_modules/.bin/next start