FROM mhart/alpine-node:12 AS builder
ARG ENV=production
WORKDIR /www
COPY package.json yarn.lock ./
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
RUN yarn install
COPY . .
RUN yarn build:$ENV

FROM mhart/alpine-node:12
ENV ENV=production
WORKDIR /www
COPY --from=builder /www .
EXPOSE 3000
ENTRYPOINT ENV=$ENV ./node_modules/.bin/next start