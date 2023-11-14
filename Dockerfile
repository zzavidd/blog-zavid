FROM node:20.8.0-slim AS builder

WORKDIR /app

RUN npm i -g bun@1.0.4
RUN apt-get update -y && apt-get install -y openssl

COPY package.json bun.lockb ./

RUN bun install --frozen-lockfile

COPY . ./

RUN bun prisma generate
RUN bun prisma migrate deploy
RUN bun run build

FROM node:20.8.0-slim AS runner

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone .
COPY --from=builder /app/.next/static ./.next/static

CMD node server.js
