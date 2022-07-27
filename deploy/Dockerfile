FROM node:16.13.1-alpine

ARG PORT
ARG WORKDIR

WORKDIR $WORKDIR
# COPY ./deploy/config.env $WORKDIR
# COPY ./deploy/.env.local $WORKDIR
COPY ./code/package.json $WORKDIR
COPY ./code/package-lock.json $WORKDIR

RUN yarn install

COPY ./code /var/www/zavid

RUN yarn run build:ci

EXPOSE $PORT

CMD ["yarn", "run", "prod"]