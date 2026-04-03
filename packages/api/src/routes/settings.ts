import { Hono } from "hono";
import { auth } from "../lib/auth.js";
import { db } from "../db/index.js";
import { appSettings } from "../db/schema/app.js";
import { eq } from "drizzle-orm";

const settingsRoutes = new Hono();

// GET /api/settings — any authenticated user can read
settingsRoutes.get("/", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const settings = await db
    .select()
    .from(appSettings)
    .where(eq(appSettings.id, 1))
    .limit(1);
  return c.json(settings[0] ?? { id: 1, registrationMode: "open" });
});

// PATCH /api/settings — admin only
settingsRoutes.patch("/", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  if (session.user.role !== "admin") {
    return c.json({ error: "Forbidden" }, 403);
  }

  const body = await c.req.json<{ registrationMode?: string }>();
  const mode = body.registrationMode;

  if (mode !== "open" && mode !== "invite") {
    return c.json(
      { error: "Invalid registration mode. Must be 'open' or 'invite'" },
      400,
    );
  }

  const updated = await db
    .update(appSettings)
    .set({ registrationMode: mode })
    .where(eq(appSettings.id, 1))
    .returning();

  if (updated.length === 0) {
    const inserted = await db
      .insert(appSettings)
      .values({ id: 1, registrationMode: mode })
      .returning();
    return c.json(inserted[0]);
  }

  return c.json(updated[0]);
});

export { settingsRoutes };
