FROM node:20.8.0-slim AS base
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl

FROM base AS builder
RUN npm i -g bun@1.0.4
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . ./
RUN bun prisma generate
RUN bun prisma migrate deploy
RUN bun run build

FROM base AS runner
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone .
COPY --from=builder /app/.next/static ./.next/static

CMD node server.js
