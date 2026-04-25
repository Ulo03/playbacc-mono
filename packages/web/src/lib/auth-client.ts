import { createAuthClient } from "better-auth/svelte";
import {
  adminClient,
  usernameClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import type { Auth } from "@playbacc/api/src/lib/auth";

export const authClient = createAuthClient({
  baseURL: import.meta.env.PUBLIC_API_URL ?? "http://127.0.0.1:3000",
  plugins: [adminClient(), usernameClient(), inferAdditionalFields<Auth>()],
});
