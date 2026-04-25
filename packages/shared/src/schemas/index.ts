// Valibot schemas shared between api and web

import * as v from "valibot";

export const UsernameSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(3, "Must be at least 3 characters"),
  v.maxLength(20, "Must be at most 20 characters"),
  v.regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores"),
);

export const NameSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(1, "Name is required"),
  v.maxLength(50, "Must be at most 50 characters"),
);

export const LocaleSchema = v.picklist(["en", "de"]);

export const SUPPORTED_TIME_FORMATS = ["12h", "24h"] as const;
export const TimeFormatSchema = v.picklist(SUPPORTED_TIME_FORMATS);

export const SUPPORTED_THEMES = ["dark", "midnight", "emerald"] as const;
export const ThemeIdSchema = v.picklist(SUPPORTED_THEMES);
export type ThemeId = v.InferOutput<typeof ThemeIdSchema>;

export const UpdateProfileSchema = v.object({
  username: v.optional(UsernameSchema),
  name: v.optional(NameSchema),
  isPublic: v.optional(v.boolean()),
  locale: v.optional(LocaleSchema),
  timeFormat: v.optional(TimeFormatSchema),
  theme: v.optional(ThemeIdSchema),
});
