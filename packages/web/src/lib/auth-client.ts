import { createAuthClient } from "better-auth/svelte";
import { adminClient, usernameClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: import.meta.env.PUBLIC_API_URL ?? "http://localhost:3000",
  plugins: [adminClient(), usernameClient()],
});
