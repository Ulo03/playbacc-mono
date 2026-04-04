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

export const UpdateProfileSchema = v.object({
  username: v.optional(UsernameSchema),
  name: v.optional(NameSchema),
  isPublic: v.optional(v.boolean()),
});
