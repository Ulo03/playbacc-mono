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
COPY tsconfig.json ./
COPY packages/shared packages/shared
COPY packages/web packages/web

WORKDIR /app
ARG VERSION=0.0.0
ARG PUBLIC_API_URL=http://127.0.0.1:3000
ARG PUBLIC_WEB_URL=http://127.0.0.1:5173
ENV PUBLIC_APP_VERSION=${VERSION}
ENV PUBLIC_API_URL=${PUBLIC_API_URL}
ENV PUBLIC_WEB_URL=${PUBLIC_WEB_URL}
RUN bun --filter @playbacc/web build


# Production deps (no devDependencies) for the runner image
FROM oven/bun:${BUN_VERSION}-alpine AS deps-prod
WORKDIR /app
COPY package.json bun.lock ./
COPY scripts/postinstall.ts scripts/postinstall.ts
COPY packages/shared/package.json packages/shared/package.json
COPY packages/web/package.json packages/web/package.json
COPY packages/api/package.json packages/api/package.json
RUN bun install --frozen-lockfile --production


FROM oven/bun:${BUN_VERSION}-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Non-root user
RUN addgroup -S app && adduser -S app -G app

# adapter-node bundles app code, but externalizes runtime deps (valibot, etc).
# Bun resolves them via its install layout. Workspace packages (@playbacc/shared)
# are symlinked into packages/shared, so we ship that too.
COPY --from=deps-prod /app/node_modules ./node_modules
COPY --from=deps-prod /app/package.json ./package.json
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/packages/web/package.json ./packages/web/package.json
COPY --from=builder /app/packages/web/build ./build

USER app
EXPOSE 3000
CMD ["bun", "build/index.js"]
