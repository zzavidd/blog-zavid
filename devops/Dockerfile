FROM node:18-slim AS builder

RUN corepack enable && corepack prepare pnpm@8.2.0 --activate
RUN apt-get update -y && apt-get install -y openssl

ARG WORKDIR
WORKDIR /var/www/$WORKDIR/code

COPY ./code/package.json ./code/pnpm-lock.yaml ./

RUN pnpm fetch

COPY ./code ./

RUN pnpm install --offline

RUN pnpm prisma generate
RUN pnpm prisma migrate deploy
RUN pnpm run build

FROM node:18-slim AS runner

RUN apt-get update -y && apt-get install -y openssl

ARG WORKDIR
WORKDIR /var/www/$WORKDIR/code

COPY --from=builder /var/www/$WORKDIR/code/package.json .
COPY --from=builder /var/www/$WORKDIR/code/.env.local .
COPY --from=builder /var/www/$WORKDIR/code/pnpm-lock.yaml .
COPY --from=builder /var/www/$WORKDIR/code/next.config.js .
COPY --from=builder /var/www/$WORKDIR/code/public ./public
COPY --from=builder /var/www/$WORKDIR/code/.next/standalone .
COPY --from=builder /var/www/$WORKDIR/code/.next/static ./.next/static

CMD node server.js
