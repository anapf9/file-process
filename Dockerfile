FROM node:20-bullseye-slim AS base-image

ENV USER_NAME=microservice
ENV APP_HOME=/opt/$USER_NAME

RUN npm i -g npm@10 && apt-get update && apt-get -y upgrade && apt-get -y install curl && apt-get -y autoremove && apt-get clean && mkdir -p "$APP_HOME"

WORKDIR $APP_HOME

FROM base-image AS dev-dependencies

RUN true
COPY ["package.json", "package-lock.json", "tsconfig.json", "./"]

RUN npm ci

FROM dev-dependencies AS code

COPY ["src", "./src/"]


FROM code AS builder

RUN npm run build

FROM node:20-alpine AS fargate

ENV USER_NAME=microservice
ENV APP_HOME=/opt/$USER_NAME

RUN npm i -g npm@10 && apk update && apk upgrade --available && sync && apk add --update curl && apk cache clean && mkdir -p "$APP_HOME"

WORKDIR $APP_HOME