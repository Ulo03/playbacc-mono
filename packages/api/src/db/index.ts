import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { env } from "../lib/env.js";
import * as schema from "./schema/index.js";

const client = postgres(env.DATABASE_URL);

export const db = drizzle(client, { schema });

export async function runMigrations() {
  const migrationClient = postgres(env.DATABASE_URL, { max: 1 });
  const migrationDb = drizzle(migrationClient);
  await migrate(migrationDb, { migrationsFolder: "./drizzle" });
  await migrationClient.end();
}
