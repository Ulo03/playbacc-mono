import { Hono } from "hono";
import * as v from "valibot";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { user } from "../db/schema/auth.js";
import { auth } from "../lib/auth.js";
import { requireAuth } from "../lib/middleware.js";
import { UsernameSchema } from "@playbacc/shared";

const profileRoutes = new Hono();

// GET /api/profile/check-username/:username — requires auth
profileRoutes.get("/check-username/:username", requireAuth, async (c) => {
  const rawUsername = c.req.param("username");
  const parsed = v.safeParse(UsernameSchema, rawUsername);
  if (!parsed.success) {
    return c.json({ error: "Invalid username format" }, 400);
  }

  const normalized = parsed.output.toLowerCase();
  const currentUser = c.get("user");

  // Own username is always "available"
  if (currentUser.username === normalized) {
    return c.json({ available: true });
  }

  const existing = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.username, normalized))
    .limit(1);

  return c.json({ available: existing.length === 0 });
});

// GET /api/profile/:username — public (auth optional)
profileRoutes.get("/:username", async (c) => {
  const username = c.req.param("username").toLowerCase();

  const rows = await db
    .select({
      id: user.id,
      username: user.username,
      displayUsername: user.displayUsername,
      name: user.name,
      image: user.image,
      isPublic: user.isPublic,
      createdAt: user.createdAt,
    })
    .from(user)
    .where(eq(user.username, username))
    .limit(1);

  const profile = rows[0];
  if (!profile) {
    return c.json({ error: "User not found" }, 404);
  }

  // Check auth for access control
  const session = await auth.api
    .getSession({ headers: c.req.raw.headers })
    .catch(() => null);

  const callerId = session?.user?.id ?? null;
  const isOwner = callerId === profile.id;

  // Restricted profile: unauthenticated users get 404 (no leak)
  if (!profile.isPublic && !callerId) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json({
    id: profile.id,
    username: profile.username,
    displayUsername: profile.displayUsername,
    name: profile.name,
    image: profile.image,
    isPublic: profile.isPublic,
    isOwner,
    createdAt: profile.createdAt,
  });
});

export { profileRoutes };
