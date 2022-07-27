FROM node:16.13.1-alpine

ARG PORT
ARG WORKDIR

WORKDIR /var/www/$WORKDIR
COPY ./code/package.json .
COPY ./code/yarn.lock .

RUN yarn install

COPY ./code ./

RUN yarn run build:ci

EXPOSE $PORT

CMD ["yarn", "run", "prod"]