FROM node:16.13.1-alpine

ARG PORT
ARG WORKDIR
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

WORKDIR /var/www/$WORKDIR/code
COPY ./code/.yarn ./.yarn/
COPY ./code/.yarnrc.yml ./
COPY ./code/package.json ./
COPY ./code/yarn.lock ./

RUN yarn install --production

COPY ./code ./

RUN yarn run build
RUN yarn run compile

EXPOSE $PORT

CMD NODE_ENV=$NODE_ENV node src/server.js
