import { sequence } from "@sveltejs/kit/hooks";
import { redirect } from "@sveltejs/kit";
import type { Handle } from "@sveltejs/kit";
import type { User, Session } from "@playbacc/shared";
import { getTextDirection } from "$lib/paraglide/runtime";
import { paraglideMiddleware } from "$lib/paraglide/server";
import { getTheme, themeToCSS } from "$lib/tokens";

const API_URL = process.env.PUBLIC_API_URL ?? "http://127.0.0.1:3000";

const handleTheme: Handle = ({ event, resolve }) => {
  // TODO: read from event.locals.user.theme once the column is added.
  const theme = getTheme(null);
  const styleBlock = `<style data-pb-theme="${theme.id}">${themeToCSS(theme)}</style>`;

  return resolve(event, {
    transformPageChunk: ({ html }) =>
      html
        .replace("%pb.theme.style%", styleBlock)
        .replace("%pb.theme.bg%", theme.colors.bg),
  });
};

const handleParaglide: Handle = ({ event, resolve }) =>
  paraglideMiddleware(event.request, ({ request, locale }) => {
    event.request = request;

    return resolve(event, {
      transformPageChunk: ({ html }) =>
        html
          .replace("%paraglide.lang%", locale)
          .replace("%paraglide.dir%", getTextDirection(locale)),
    });
  });

const handleAuth: Handle = async ({ event, resolve }) => {
  const cookie = event.request.headers.get("cookie");

  if (!cookie) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/get-session`, {
      headers: { cookie },
    });

    if (response.ok) {
      const data = (await response.json()) as {
        user: User;
        session: Session;
      } | null;
      event.locals.user = data?.user ?? null;
      event.locals.session = data?.session ?? null;
    } else {
      event.locals.user = null;
      event.locals.session = null;
    }
  } catch {
    event.locals.user = null;
    event.locals.session = null;
  }

  // Sync locale from DB to cookie
  if (event.locals.user) {
    const stored = event.locals.user.locale;
    const current = event.cookies.get("PARAGLIDE_LOCALE");
    if (stored !== current) {
      event.cookies.set("PARAGLIDE_LOCALE", stored, {
        path: "/",
        maxAge: 34560000,
        httpOnly: false,
        sameSite: "lax",
      });
    }
  }

  // Redirect to /settings if username is not set
  const pathname = event.url.pathname;
  if (
    event.locals.user &&
    !event.locals.user.username &&
    pathname !== "/settings" &&
    pathname !== "/login" &&
    !pathname.startsWith("/api")
  ) {
    redirect(302, "/settings");
  }

  return resolve(event);
};

// handleAuth sets locals.user, handleTheme reads it, handleParaglide reads locale
export const handle: Handle = sequence(
  handleAuth,
  handleTheme,
  handleParaglide,
);
