import { pgTable, integer, text, timestamp } from "drizzle-orm/pg-core";

export const appSettings = pgTable("app_settings", {
  id: integer("id").primaryKey().default(1),
  registrationMode: text("registration_mode").notNull().default("open"),
});

export const invites = pgTable("invites", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
