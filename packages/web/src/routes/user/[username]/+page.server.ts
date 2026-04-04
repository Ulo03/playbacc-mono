import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

const API_URL = process.env.PUBLIC_API_URL ?? "http://127.0.0.1:3000";

export const load: PageServerLoad = async ({ params, request }) => {
  const headers: Record<string, string> = {};
  const cookie = request.headers.get("cookie");
  if (cookie) {
    headers.cookie = cookie;
  }

  const res = await fetch(
    `${API_URL}/api/profile/${encodeURIComponent(params.username)}`,
    {
      headers,
    },
  );

  if (res.status === 404) {
    // API returns 404 for both nonexistent users and restricted profiles
    // when the caller is unauthenticated — no information leak
    error(404, "User not found");
  }

  if (!res.ok) {
    error(res.status, "Failed to load profile");
  }

  return {
    profile: await res.json(),
  };
};
