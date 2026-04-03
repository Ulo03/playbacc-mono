import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "./lib/env.js";
import { runMigrations } from "./db/index.js";
import { authRoutes } from "./routes/auth.js";
import { settingsRoutes } from "./routes/settings.js";
import { inviteRoutes } from "./routes/invites.js";
import { profileRoutes } from "./routes/profile.js";

await runMigrations();

const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: env.WEB_URL,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

app.route("/api/auth", authRoutes);
app.route("/api/settings", settingsRoutes);
app.route("/api/invites", inviteRoutes);
app.route("/api/profile", profileRoutes);

app.get("/", (c) => {
  return c.text("Playbacc API");
});

export default app;
