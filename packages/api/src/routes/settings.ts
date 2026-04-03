import { Hono } from "hono";
import * as v from "valibot";
import { db } from "../db/index.js";
import { appSettings } from "../db/schema/app.js";
import { eq } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../lib/middleware.js";

const settingsRoutes = new Hono();

const UpdateSettingsSchema = v.object({
  registrationMode: v.picklist(["open", "invite"]),
});

// GET /api/settings — any authenticated user can read
settingsRoutes.get("/", requireAuth, async (c) => {
  const settings = await db
    .select()
    .from(appSettings)
    .where(eq(appSettings.id, 1))
    .limit(1);
  return c.json(settings[0] ?? { id: 1, registrationMode: "open" });
});

// PATCH /api/settings — admin only
settingsRoutes.patch("/", requireAdmin, async (c) => {
  const body = await c.req.json();
  const parsed = v.safeParse(UpdateSettingsSchema, body);
  if (!parsed.success) {
    return c.json(
      { error: "Invalid registration mode. Must be 'open' or 'invite'" },
      400,
    );
  }

  const { registrationMode } = parsed.output;

  const updated = await db
    .update(appSettings)
    .set({ registrationMode })
    .where(eq(appSettings.id, 1))
    .returning();

  if (updated.length === 0) {
    const inserted = await db
      .insert(appSettings)
      .values({ id: 1, registrationMode })
      .returning();
    return c.json(inserted[0]);
  }

  return c.json(updated[0]);
});

export { settingsRoutes };
