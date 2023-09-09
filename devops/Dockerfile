FROM node:18.17.1-slim AS builder

ARG WORKDIR
WORKDIR /var/www/$WORKDIR/code

RUN npm i -g bun

COPY ./code/package.json ./code/bun.lockb ./

RUN bun install --frozen-lockfile

COPY ./code ./

RUN bun prisma generate
RUN bun prisma migrate deploy
RUN bun run build

FROM node:18.17.1-slim AS runner

ARG WORKDIR
WORKDIR /var/www/$WORKDIR/code

COPY --from=builder /var/www/$WORKDIR/code/public ./public
COPY --from=builder /var/www/$WORKDIR/code/.next/standalone .
COPY --from=builder /var/www/$WORKDIR/code/.next/static ./.next/static

CMD node server.js
