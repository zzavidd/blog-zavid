FROM nginx:alpine

COPY ./deploy/nginx.conf /etc/nginx/nginx.conf

VOLUME /etc/nginx/sites-available /etc/nginx/conf.d
VOLUME /etc/letsencrypt /etc/letsencrypt

RUN apk add --no-cache --update npm

RUN mkdir -p /var/www/zavid
WORKDIR /var/www/zavid

COPY ./deploy/config.env /var/www/zavid/
COPY ./deploy/.env.local /var/www/zavid/
COPY ./code/package.json /var/www/zavid/
COPY ./code/package-lock.json /var/www/zavid/

RUN yarn install

COPY ./code /var/www/zavid

RUN yarn run build:ci

EXPOSE 4000

CMD ["npm", "run", "prod"]
