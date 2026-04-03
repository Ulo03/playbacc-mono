// packages/api/src/lib/auth.ts

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { bearer, admin, username } from "better-auth/plugins";
import { APIError } from "better-auth/api";
import { db } from "../db/index.js";
import { appSettings, invites } from "../db/schema/app.js";
import { eq } from "drizzle-orm";
import { env } from "./env.js";

export const auth = betterAuth({
  baseURL: env.API_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: [env.WEB_URL],

  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  socialProviders: {
    spotify: {
      clientId: env.SPOTIFY_CLIENT_ID,
      clientSecret: env.SPOTIFY_CLIENT_SECRET,
      scope: [
        "user-read-recently-played",
        "user-read-currently-playing",
        "user-read-email",
        "user-read-private",
      ],
    },
  },

  user: {
    additionalFields: {
      isPublic: {
        type: "boolean",
        defaultValue: false,
      },
    },
  },

  plugins: [bearer(), admin(), username()],

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Seed app_settings if it doesn't exist
          const existingSettings = await db
            .select({ id: appSettings.id })
            .from(appSettings)
            .limit(1);
          if (existingSettings.length === 0) {
            await db
              .insert(appSettings)
              .values({ id: 1, registrationMode: "open" });
          }

          // Check if any users exist — if not, this is the first user, always allow
          const ctx = await auth.$context;
          const userCount = await ctx.adapter.count({ model: "user" });
          if (userCount === 0) {
            return;
          }

          // Check registration mode
          const settings = await db
            .select()
            .from(appSettings)
            .where(eq(appSettings.id, 1))
            .limit(1);
          const mode = settings[0]?.registrationMode ?? "open";

          if (mode === "invite") {
            // Check if email is on the invite list
            const invite = await db
              .select()
              .from(invites)
              .where(eq(invites.email, user.email))
              .limit(1);
            if (invite.length === 0) {
              throw new APIError("FORBIDDEN", {
                message: "Registration is invite-only",
              });
            }
          }
        },
      },
    },
  },
});

export type Auth = typeof auth;
