FROM node:16.13.1-alpine

ARG PORT
ARG WORKDIR

WORKDIR /var/www/$WORKDIR/code
COPY ./code/.yarn ./.yarn/
COPY ./code/.yarnrc.yml ./
COPY ./code/package.json ./
COPY ./code/yarn.lock ./

RUN yarn run install
VOLUME ./code/node_modules /var/www/$WORKDIR/code/node_modules

COPY ./code ./

RUN yarn run build

EXPOSE $PORT

CMD yarn run start
