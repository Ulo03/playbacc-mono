# Playbacc

Music listening history tracker. Self-hosted, AGPL-3.0.

## Stack

- **Monorepo**: Bun workspaces (`packages/api`, `packages/web`, `packages/shared`)
- **API**: Hono on Bun
- **Web**: SvelteKit 2 (Svelte 5) with adapter-node, UnoCSS, Paraglide (i18n — en, de)
- **Auth**: better-auth with Spotify OAuth (bearer, admin, username plugins)
- **DB**: Postgres via Drizzle ORM (migrations auto-run on API startup)
- **Validation**: Valibot (shared between api and web)
- **Icons**: lucide-svelte
- **Linting/Formatting**: ESLint 10 (flat config) + Prettier, with UnoCSS eslint plugin
- **Pre-commit**: Lefthook (runs Prettier + ESLint in parallel, auto-stages fixes)
- **E2E Testing**: Playwright
- **Local infra**: Docker Compose (Postgres 18 + pgweb)

## Conventions

- Use `bun` for everything (install, run, test) — never node/npm/npx
- Bun auto-loads `.env` — no dotenv
- API: `bun run --hot src/index.ts` for dev
- Web: `bunx vite dev` for dev (required by SvelteKit)
- snake_case for app DB tables, camelCase for better-auth tables
- All config via env vars with sensible defaults
- Shared types/schemas go in `packages/shared`, never duplicate

## Dependencies

- Never add or remove dependencies by editing `package.json` directly
- Always use `bun add <pkg>` / `bun remove <pkg>` in the relevant package directory
- For workspace deps: add `"@playbacc/shared": "workspace:*"` manually to `package.json`

## Package dependencies

- `shared` has no internal deps (only valibot)
- `api` depends on `shared`
- `web` depends on `shared`
- `web` never imports from `api` — communicates via HTTP only

## Components & styling

Use **Bits UI** for headless primitives (Button, Switch, etc.) styled with UnoCSS.

**Reusable components:** Before writing inline UI, check `packages/web/src/lib/components/` for existing components (FormField, ToggleCard, SettingsSelect, SettingsRadioGroup, UserHeader, etc.). Prefer creating new reusable components over duplicating markup across pages.

**Mobile-first throughout:** All components and layouts are designed for small screens first, then enhanced for larger viewports via `sm:` / `md:` UnoCSS breakpoint prefixes. Base styles target mobile — never write desktop-first CSS that gets overridden downward.
