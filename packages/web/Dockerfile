# syntax=docker/dockerfile:1.7

ARG BUN_VERSION=1.3.5

FROM oven/bun:${BUN_VERSION}-alpine AS builder
WORKDIR /app

# Install dependencies (workspace)
COPY package.json bun.lock ./
COPY scripts/postinstall.ts scripts/postinstall.ts
COPY packages/shared/package.json packages/shared/package.json
COPY packages/web/package.json packages/web/package.json
# include api package.json to satisfy workspaces resolution (workspaces = packages/*)
COPY packages/api/package.json packages/api/package.json
RUN bun install --frozen-lockfile

# Build web
COPY packages/shared packages/shared
COPY packages/web packages/web

WORKDIR /app
ARG VERSION=0.0.0
ENV PUBLIC_APP_VERSION=${VERSION}
RUN bun --filter @playbacc/web build


FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Non-root user
RUN addgroup -S app && adduser -S app -G app

COPY --from=builder /app/packages/web/build ./build

USER app
EXPOSE 3000
CMD ["node", "build/index.js"]
