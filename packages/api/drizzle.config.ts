import { defineConfig } from "drizzle-kit";

const DB_USER = process.env.DB_USER ?? "playbacc";
const DB_PASSWORD = process.env.DB_PASSWORD ?? "playbacc";
const DB_HOST = process.env.DB_HOST ?? "localhost";
const DB_PORT = process.env.DB_PORT ?? "5432";
const DB_NAME = process.env.DB_NAME ?? "playbacc";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  },
});
