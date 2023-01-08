FROM node:16.13.1-alpine

ARG WORKDIR

WORKDIR /var/www/$WORKDIR/code
COPY ./code/.yarn ./.yarn/
COPY ./code/.yarnrc.yml ./
COPY ./code/package.json ./
COPY ./code/yarn.lock ./

RUN yarn install

COPY ./code ./

RUN yarn prisma generate
RUN yarn run build

CMD yarn run start
