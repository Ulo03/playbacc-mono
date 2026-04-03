import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "./lib/env.js";
import { authRoutes } from "./routes/auth.js";

const app = new Hono();

app.use(
  "/api/auth/*",
  cors({
    origin: env.WEB_URL,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

app.route("/api/auth", authRoutes);

app.get("/", (c) => {
  return c.text("Playbacc API");
});

export default app;
