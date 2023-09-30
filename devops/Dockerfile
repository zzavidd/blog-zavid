FROM node:18.17.1-slim AS builder

ARG WORKDIR
WORKDIR /var/www/$WORKDIR

RUN npm i -g bun
RUN apt-get update -y && apt-get install -y openssl

COPY package.json bun.lockb ./

RUN bun install --frozen-lockfile

COPY . ./

RUN bun prisma generate
RUN bun prisma migrate deploy
RUN bun run build

FROM node:18.17.1-slim AS runner

ARG WORKDIR
WORKDIR /var/www/$WORKDIR

RUN apt-get update -y && apt-get install -y openssl

COPY --from=builder /var/www/$WORKDIR/public ./public
COPY --from=builder /var/www/$WORKDIR/.next/standalone .
COPY --from=builder /var/www/$WORKDIR/.next/static ./.next/static

CMD node server.js
