FROM node:16.13.1-alpine

ARG PORT
ARG WORKDIR

WORKDIR /var/www/$WORKDIR/code
COPY ./code/.yarn ./.yarn/
COPY ./code/.yarnrc.yml ./
COPY ./code/package.json ./
COPY ./code/yarn.lock ./

# RUN yarn set version ./.yarn/releases/yarn-3.2.2.cjs
RUN yarn install

COPY ./code ./

RUN yarn run build

EXPOSE $PORT

CMD ["yarn", "run", "prod"]