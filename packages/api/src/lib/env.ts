const DB_USER = process.env.DB_USER ?? "playbacc";
const DB_PASSWORD = process.env.DB_PASSWORD ?? "playbacc";
const DB_HOST = process.env.DB_HOST ?? "localhost";
const DB_PORT = process.env.DB_PORT ?? "5432";
const DB_NAME = process.env.DB_NAME ?? "playbacc";

const REDIS_HOST = process.env.REDIS_HOST ?? "localhost";
const REDIS_PORT = process.env.REDIS_PORT ?? "6379";

export const env = {
  DATABASE_URL:
    process.env.DATABASE_URL ??
    `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  REDIS_URL: process.env.REDIS_URL ?? `redis://${REDIS_HOST}:${REDIS_PORT}`,
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID ?? "",
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET ?? "",
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ?? "",
  API_URL: process.env.API_URL ?? "http://127.0.0.1:3000",
  WEB_URL: process.env.WEB_URL ?? "http://127.0.0.1:5173",
} as const;
