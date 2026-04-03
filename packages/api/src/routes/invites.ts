import { Hono } from "hono";
import * as v from "valibot";
import { db } from "../db/index.js";
import { invites } from "../db/schema/app.js";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../lib/middleware.js";

const inviteRoutes = new Hono();

const CreateInviteSchema = v.object({
  email: v.pipe(v.string(), v.email()),
});

// GET /api/invites — admin only, list all invites
inviteRoutes.get("/", requireAdmin, async (c) => {
  const allInvites = await db.select().from(invites);
  return c.json(allInvites);
});

// POST /api/invites — admin only, create invite
inviteRoutes.post("/", requireAdmin, async (c) => {
  const body = await c.req.json();
  const parsed = v.safeParse(CreateInviteSchema, body);
  if (!parsed.success) {
    return c.json({ error: "A valid email address is required" }, 400);
  }

  const created = await db
    .insert(invites)
    .values({ email: parsed.output.email })
    .returning();
  return c.json(created[0], 201);
});

// DELETE /api/invites/:id — admin only, delete invite
inviteRoutes.delete("/:id", requireAdmin, async (c) => {
  const id = c.req.param("id");
  await db.delete(invites).where(eq(invites.id, id));
  return c.body(null, 204);
});

export { inviteRoutes };
