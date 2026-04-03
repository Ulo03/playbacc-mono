export const env = {
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID ?? "",
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET ?? "",
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ?? "",
  API_URL: process.env.API_URL ?? "http://localhost:3000",
  WEB_URL: process.env.WEB_URL ?? "http://localhost:5173",
} as const;
