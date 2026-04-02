# syntax=docker/dockerfile:1.7

ARG BUN_VERSION=1.3.5

FROM oven/bun:${BUN_VERSION}-alpine AS builder
WORKDIR /app

# Install dependencies (workspace)
COPY package.json bun.lock ./
COPY packages/shared/package.json packages/shared/package.json
COPY packages/api/package.json packages/api/package.json
COPY packages/web/package.json packages/web/package.json
RUN bun install --frozen-lockfile --production

# Build (bundle) API
COPY packages/shared packages/shared
COPY packages/api packages/api

WORKDIR /app/packages/api
ARG VERSION=0.0.0
RUN bun build src/index.ts \
  --outdir dist \
  --target bun \
  --bundle \
  --minify \
  --sourcemap \
  --define:__PLAYBACC_VERSION__=\"${VERSION}\"


FROM oven/bun:${BUN_VERSION}-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Non-root user
RUN addgroup -S app && adduser -S app -G app

COPY --from=builder /app/packages/api/dist ./dist

USER app
EXPOSE 3000
CMD ["bun", "dist/index.js"]
