FROM node:18-slim

RUN apt-get update -y && apt-get install -y openssl

ARG WORKDIR

WORKDIR /var/www/$WORKDIR/code
COPY ./code/.yarn ./.yarn/
COPY ./code/.yarnrc.yml .
COPY ./code/package.json .
COPY ./code/yarn.lock .

RUN yarn install

COPY ./code ./

RUN yarn prisma generate
RUN yarn run build

CMD yarn run start
