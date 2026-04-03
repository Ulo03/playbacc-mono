import { Hono } from "hono";
import { auth } from "../lib/auth.js";
import { db } from "../db/index.js";
import { invites } from "../db/schema/app.js";
import { eq } from "drizzle-orm";

const inviteRoutes = new Hono();

// GET /api/invites — admin only, list all invites
inviteRoutes.get("/", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  if (session.user.role !== "admin") {
    return c.json({ error: "Forbidden" }, 403);
  }

  const allInvites = await db.select().from(invites);
  return c.json(allInvites);
});

// POST /api/invites — admin only, create invite
inviteRoutes.post("/", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  if (session.user.role !== "admin") {
    return c.json({ error: "Forbidden" }, 403);
  }

  const body = await c.req.json<{ email?: string }>();
  if (!body.email) {
    return c.json({ error: "Email is required" }, 400);
  }

  const created = await db
    .insert(invites)
    .values({ email: body.email })
    .returning();
  return c.json(created[0], 201);
});

// DELETE /api/invites/:id — admin only, delete invite
inviteRoutes.delete("/:id", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  if (session.user.role !== "admin") {
    return c.json({ error: "Forbidden" }, 403);
  }

  const id = c.req.param("id");
  await db.delete(invites).where(eq(invites.id, id));
  return c.body(null, 204);
});

export { inviteRoutes };
