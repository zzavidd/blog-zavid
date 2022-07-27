FROM node:16.13.1-alpine

ARG PORT
ARG WORKDIR

WORKDIR /var/www/$WORKDIR/code
COPY ./code/.yarn ./code/package.json ./code/yarn.lock ./

RUN yarn install

COPY ./code ./

# ENTRYPOINT ["tail", "-f", "/dev/null"]

RUN yarn run build

EXPOSE $PORT

CMD ["yarn", "run", "prod"]