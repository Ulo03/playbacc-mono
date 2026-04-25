# Tech stack

playbacc is a self-hosted, open-source personal music listening analytics platform. This document describes every technology choice in the project and the reasoning behind it.

---

## Overview

| Layer            | Choice                            |
| ---------------- | --------------------------------- |
| Runtime          | Bun 1.x                           |
| Framework        | SvelteKit 2 + Svelte 5            |
| Styling          | UnoCSS                            |
| Components       | Bits UI                           |
| Skeleton loading | Boneyard                          |
| Icons            | Lucide (Svelte)                   |
| Charts           | LayerChart 2.x + D3 modules       |
| API              | Hono + hono/client RPC            |
| Validation       | Valibot + @hono/valibot-validator |
| ORM              | Drizzle ORM + postgres.js         |
| Auth             | Better Auth + Spotify provider    |
| Queue            | BullMQ + Redis                    |
| Database         | PostgreSQL 16                     |
| Proxy            | Caddy 2                           |

---

## Monorepo structure

```
playbacc/
├── packages/
│   ├── api/        @playbacc/api    — Hono server + BullMQ workers
│   ├── web/        @playbacc/web    — SvelteKit frontend
│   └── shared/     @playbacc/shared — Valibot schemas + shared types
├── docs/
└── package.json                     — Bun workspace root
```

---

## Runtime & tooling

### Bun 1.x

Replaces Node.js as the runtime and pnpm/npm as the package manager. Used for running the API server (`bun run src/index.ts`), the SvelteKit build output (`bun build/index.js`), and all scripts. `bun test` replaces Vitest for unit tests — the API is Jest-compatible so migration cost is zero. Bun's faster cold starts and install times are meaningful in Docker multi-stage builds.

### TypeScript

Strict mode throughout all packages. Types flow end-to-end: Drizzle schema → Valibot validators → Hono route types → `hono/client` inference in the web package.

### Valibot

Schema validation library at ~1kb (vs Zod's ~50kb). Used in three places:

- `@playbacc/shared` — canonical schema definitions shared across packages
- `@playbacc/api` — request validation via `@hono/valibot-validator` middleware
- `@playbacc/web` — form validation

`drizzle-valibot` generates Valibot insert/select schemas directly from Drizzle table definitions, giving a single source of truth from DB schema through to API and form validation.

---

## Frontend

### SvelteKit 2 + Svelte 5

SvelteKit is the full-stack framework for the web package. Svelte 5's runes (`$state`, `$derived`, `$effect`) replace the Svelte 4 reactivity model and are required by the component libraries in use (Bits UI, LayerChart 2.x). The compiled output produces significantly smaller bundles than React-based alternatives, which matters for chart-heavy dashboard pages with frequent re-renders.

`@sveltejs/adapter-node` compiles SvelteKit to a standard Node-compatible server entrypoint (`build/index.js`) that Bun runs directly.

### UnoCSS

Atomic CSS engine, Tailwind-compatible. Faster build times than Tailwind v4 via on-demand class generation. The `@unocss/extractor-svelte` package handles Svelte single-file component scanning correctly. Utility class syntax is identical to Tailwind so existing knowledge transfers directly.

### Bits UI

Headless, accessible UI primitives for Svelte 5. The underlying primitive layer that shadcn-svelte is built on — used here directly for tighter control over component styling without an intermediate abstraction layer. Fully Svelte 5 runes-native as of v2.x.

### Boneyard

Auto-generated skeleton loading screens. The CLI (`npx boneyard-js build`) visits the running dev server in a headless browser, snapshots the DOM geometry of every `<Skeleton name="...">` component via `getBoundingClientRect()`, and writes a flat `{ x, y, w, h, r }` bones registry. At runtime, the Svelte component renders pixel-perfect placeholder rectangles that match the real layout exactly — no hand-written placeholder shapes.

The Vite plugin (`boneyardPlugin()`) integrates into the SvelteKit Vite config so bones are regenerated automatically during development without a second terminal. Supports `pulse`, `shimmer`, and `solid` animations, responsive breakpoints, and Svelte 5 snippets for `fallback` and `fixture` slots.

### Lucide (Svelte)

`lucide-svelte` — 1,500+ consistent stroke icons, tree-shakable, official Svelte package. Used throughout the dashboard UI.

### Theming

Multi-theme system based on CSS custom properties. The `packages/web/src/lib/tokens/` module exports a small set of `Theme` objects (currently `dark`, `midnight`, `emerald`) — each defines a flat `ThemeColors` palette (background, surface, primary, text, status colors, focus ring).

A SvelteKit hook (`handleTheme` in `hooks.server.ts`) resolves the active theme per request, renders its palette as a `<style data-pb-theme>` block on `<html>` via the `%pb.theme.style%` template token in `app.html`, and also emits the `theme-color` `<meta>` for mobile chrome. UnoCSS exposes the palette as `pb-*` utility classes (`bg-pb-bg-surface`, `text-pb-text-secondary`, `border-pb-border`, etc.) that resolve to `var(--color-*)` — so a single CSS variable swap reskins the whole app without re-rendering Svelte components or shipping per-theme stylesheets.

Theme choice is persisted on the user record (Better Auth `additionalFields`) and falls back to a cookie for anonymous visitors. `prefers-color-scheme` is not consulted — themes are a personality choice, not a brightness toggle. Each theme declares a `colorScheme` field (`"light" | "dark"`) that drives the CSS `color-scheme` property so native form controls and scrollbars match.

### svelte-sonner

Toast notification library for Svelte. Used for background job status notifications (sync started, enrichment completed, API errors).

---

## Data visualization

### LayerChart 2.x

Primary charting library. Built on Layer Cake (headless graphics framework) and D3 modules. Native Svelte 5 support — components use runes internally. Covers the majority of chart types needed: area, bar, line, radial/arc, calendar heatmap, and streaming/brush interactions.

LayerChart is canonized as the chart engine inside shadcn-svelte's Chart component, making it the de facto standard for Svelte data visualization in 2026.

Pinned to `2.0.0-next.X` (prerelease) — the v1 stable release is Svelte 4 only.

### D3 modules

Raw D3 is used only for charts that LayerChart doesn't cover — specifically the artist bar chart race, which requires `d3.transition()`-free animations driven by Svelte's `Tween` rune and `animate:flip`. Only the math modules are imported (`d3-scale`, `d3-shape`, `d3-array`, `d3-time`, `d3-time-format`); `d3-selection` is never used — Svelte renders all SVG.

---

## API

### Hono

HTTP framework for `@playbacc/api`. Runs as a standalone Bun process on its own port, separate from the SvelteKit dev server. Chosen over Express for its TypeScript-first design, sub-millisecond routing overhead, and native support for the RPC client pattern.

### hono/client

Typed RPC client. `hc<AppType>()` infers the full route type from the Hono app definition and produces a typed `fetch`-based client with no codegen step. The web package imports `AppType` from `@playbacc/api` as a workspace dev dependency — `hono` itself is not installed in the web package.

### @hono/valibot-validator

Hono middleware that validates request query params, body, and params against Valibot schemas before the route handler runs. Invalid requests are rejected with a typed 400 response automatically.

---

## Database

### PostgreSQL 16

Primary data store. Stores all listening events, track/artist/album metadata, MusicBrainz enrichment data, and Better Auth session tables.

The `play` table is designed to be hypertable-compatible from day one (`PRIMARY KEY (id, played_at)`) so TimescaleDB can be adopted later via `SELECT create_hypertable(...)` without a migration, if query performance requires it at scale.

Key design decisions:

- Per-play event log always kept (never aggregate-only)
- Multi-artist tracks modeled via `track_artist` junction table with `position` and `role`
- `enrichment_status` lifecycle column on tracks (`pending` → `enriched` / `failed` / `not_found`) with exponential backoff
- Raw Spotify payload stored as `jsonb` on plays for forensics and replay
- Composite UNIQUE on `(user_id, played_at, source_track_id)` prevents duplicate ingestion

### Redis

Used exclusively as the BullMQ backend. Configured with `maxmemory 64mb` for 1GB VPS deployments. Not used for caching or session storage — Better Auth stores sessions in PostgreSQL.

### Drizzle ORM

TypeScript ORM with a SQL-like query builder. At ~7kb it's the lightest ORM option. The `sql` template tag provides an escape hatch for analytics queries that require window functions, CTEs, `date_trunc`, and `generate_series` — these stay type-safe via column references (`${plays.userId}`) while allowing arbitrary SQL.

`drizzle-kit` manages schema migrations (`generate` + `migrate`, never `push` in production).

### postgres.js (Porsager)

PostgreSQL driver. Bun-native, single connection pool shared between Drizzle and any raw queries. Faster than `pg` (`node-postgres`) for Bun workloads.

---

## Authentication

### Better Auth + Spotify provider

Better Auth handles the full Spotify OAuth flow — authorization, callback, access token storage, and automatic refresh token rotation. Tokens are stored encrypted in PostgreSQL.

The critical feature for this project: `auth.api.getAccessToken({ providerId: 'spotify', accountId })` can be called directly from BullMQ worker handlers to always retrieve a valid, non-expired Spotify token. This is the only mainstream TypeScript auth library that handles refresh token rotation automatically for built-in providers in 2026 — Auth.js explicitly does not.

Spotify-specific notes:

- As of November 2025, Spotify requires `https://` redirect URIs in production (`http://127.0.0.1` is allowed for local dev)
- Always preserve the old refresh token if Spotify omits it from a refresh response
- On `error: 'invalid_grant'`, mark the user as needing re-auth and pause polling

---

## Background jobs

### BullMQ

Redis-backed job queue. Chosen over Graphile Worker (PostgreSQL-backed) because Graphile Worker has incomplete `node:worker_threads` compatibility on Bun.

Workers run in-process inside `@playbacc/api`, started from the same entry point as the Hono server.

#### Queue: `spotify`

Polls the Spotify "currently playing" and "recently played" endpoints every 30 seconds. Implemented as a self-perpetuating job — each handler re-enqueues itself with a 30-second delay on completion. A singleton `jobId` prevents duplicate jobs accumulating across restarts.

```
concurrency: 1
delay: 30_000ms (re-enqueue at end of handler)
jobId: 'spotify-poll-singleton'
```

#### Queue: `musicbrainz`

Enriches tracks, artists, and albums with MusicBrainz metadata. Respects MusicBrainz's 1 request/second rate limit via BullMQ's token bucket limiter — the worker's fetch loop pauses when the bucket empties rather than firing and catching 429s.

```
concurrency: 1
limiter: { max: 1, duration: 1_000 }
attempts: 5
backoff: exponential, starting at 60_000ms
```

---

## Infrastructure

### Docker Compose

Four containers:

| Container  | Image                | Notes                             |
| ---------- | -------------------- | --------------------------------- |
| `app`      | `oven/bun:1-alpine`  | SvelteKit + Hono + BullMQ workers |
| `postgres` | `postgres:16-alpine` | Primary database                  |
| `redis`    | `redis:7-alpine`     | BullMQ backend, `maxmemory 64mb`  |
| `caddy`    | `caddy:2-alpine`     | Reverse proxy, auto HTTPS         |

The `app` image is built as a multi-stage `oven/bun:1-alpine` — builder stage installs all deps and builds both packages; runner stage copies only the build output and production deps. Final image size is approximately 100–120MB. The process runs as a non-root `bun` user.

An optional fifth `backup` container runs a daily `pg_dump -Fc | gzip` with 14-day retention.

Target working memory for the full stack: ~700MB, fits comfortably on a 2GB VPS (Hetzner CX22, ~€4/month).

### Caddy 2

Reverse proxy with automatic Let's Encrypt certificate provisioning and renewal. HTTP/3 enabled by default. Configuration is a single `reverse_proxy app:3000` block — no manual certificate management required.

---

## Key architectural decisions

**Separate API and web processes** — `@playbacc/api` runs as its own Bun process on a dedicated port. The SvelteKit web package fetches from the API over HTTP using the typed `hono/client`. This means CORS and auth cookie forwarding must be configured between the two, but it gives a cleaner separation of concerns and makes the API independently consumable by future CLI tools, mobile apps, or Home Assistant integrations.

**PostgreSQL-only auth storage** — Better Auth stores sessions in PostgreSQL, not Redis. Redis is exclusively for BullMQ. This keeps Redis stateless and disposable — losing the Redis container loses only queued jobs, not user sessions.

**ListenBrainz API as secondary ingest contract** — the API exposes a ListenBrainz-compatible ingest endpoint in addition to the Spotify poller. This gives instant interop with the entire scrobbler ecosystem (multi-scrobbler, Navidrome, Web Scrobbler, Pano Scrobbler) at near-zero implementation cost.

**Spotify Extended Streaming History import** — users can upload the ZIP from their Spotify data export to backfill their entire listening history. Without this, the dashboard is only useful after 90+ days of polling. With it, it's useful on day one.
