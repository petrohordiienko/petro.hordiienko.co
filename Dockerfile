# syntax=docker/dockerfile:1

FROM oven/bun:1.4-slim AS runtime-base

RUN groupadd --system app \
    && useradd --system --gid app --create-home app

WORKDIR /app
RUN chown app:app /app

ENV PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1
EXPOSE 3000

FROM oven/bun:1.4-slim AS builder

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app
# bun.lock* is optional: the glob keeps the build working until a lockfile is committed
COPY package.json bun.lock* ./
RUN bun install

COPY . .
RUN mkdir -p public && bun --bun run build

RUN rm -rf node_modules && bun install --production

FROM runtime-base AS dev

USER app

COPY --chown=app:app package.json bun.lock* ./
RUN bun install

CMD ["bun", "--bun", "next", "dev", "-H", "0.0.0.0"]

FROM runtime-base AS prod

ENV NODE_ENV=production

COPY --from=builder --chown=app:app /app/package.json /app/next.config.mjs /app/tsconfig.json ./
COPY --from=builder --chown=app:app /app/node_modules ./node_modules
COPY --from=builder --chown=app:app /app/public ./public
COPY --from=builder --chown=app:app /app/.next ./.next

USER app

CMD ["bun", "--bun", "next", "start"]
