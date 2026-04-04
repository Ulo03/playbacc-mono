import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
  // Strip token/ipAddress/userAgent — auth uses httpOnly cookies,
  // so the bearer token must never reach client-side JavaScript
  const session = locals.session;
  return {
    user: locals.user,
    session: session
      ? { id: session.id, expiresAt: session.expiresAt, userId: session.userId }
      : null,
  };
};
