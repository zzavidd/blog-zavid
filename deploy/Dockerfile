FROM node:16.13.1-alpine

ARG PORT
ARG WORKDIR

WORKDIR /var/www/$WORKDIR/code
COPY ./code/.yarn ./.yarn/
COPY ./code/package.json ./code/yarn.lock ./

RUN yarn set version ./.yarn/releases/yarn-3.2.2.cjs

COPY ./code ./

RUN yarn install
RUN yarn run build

EXPOSE $PORT

CMD ["yarn", "run", "prod"]