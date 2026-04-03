import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { bearer, admin, username } from "better-auth/plugins";
import { db } from "../db/index.js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [bearer(), admin(), username()],
  user: {
    additionalFields: {
      isPublic: {
        type: "boolean",
        defaultValue: false,
      },
    },
  },
});
