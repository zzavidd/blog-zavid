FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/nginx.conf

RUN apk add --no-cache --update npm

RUN mkdir -p /var/www/zavid
WORKDIR /var/www/zavid

COPY ./config.env /var/www/zavid
COPY ./.env.local /var/www/zavid
COPY ../code/package.json /var/www/zavid
COPY ../code/package-lock.json /var/www/zavid

RUN npm ci

COPY ../code /var/www/zavid

RUN npm run build:ci

EXPOSE 4000

CMD ["npm", "run", "prod"]