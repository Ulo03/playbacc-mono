# Playbacc

Music listening history tracker. Self-hosted, AGPL-3.0.

## Stack

- **Monorepo**: Bun workspaces (`packages/api`, `packages/web`, `packages/shared`)
- **API**: Hono on Bun
- **Web**: SvelteKit 5 with adapter-node, UnoCSS, Paraglide (i18n)
- **Auth**: better-auth with Spotify OAuth
- **DB**: Postgres via Drizzle ORM
- **Validation**: Valibot (shared between api and web)
- **Linting/Formatting**: Vite+ (Oxlint/Oxfmt)

## Conventions

- Use `bun` for everything (install, run, test) — never node/npm/npx
- Bun auto-loads `.env` — no dotenv
- API: `bun run --hot src/index.ts` for dev
- Web: `vite dev` for dev (required by SvelteKit)
- snake_case for app DB tables, camelCase for better-auth tables
- All config via env vars with sensible defaults
- Shared types/schemas go in `packages/shared`, never duplicate

## Dependencies

- Never add or remove dependencies by editing `package.json` directly
- Always use `bun add <pkg>` / `bun remove <pkg>` in the relevant package directory
- For workspace deps: add `"@playbacc/shared": "workspace:*"` manually to `package.json`

## Package dependencies

- `shared` has no internal deps
- `api` depends on `shared`
- `web` depends on `shared`
- `web` never imports from `api` — communicates via HTTP only
