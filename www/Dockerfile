FROM mhart/alpine-node:12 AS builder
WORKDIR /www
COPY package.json yarn.lock ./
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
RUN yarn install
COPY . .
ARG ENV=production
RUN yarn build:$ENV

FROM mhart/alpine-node:12
WORKDIR /www
COPY --from=builder /www .
EXPOSE 3000
ENTRYPOINT NODE_ENV=production ./node_modules/.bin/next start