import { dark } from "./themes/dark";
import { midnight } from "./themes/midnight";
import { emerald } from "./themes/emerald";
import type { Theme, ThemeId, ThemeSummary } from "./types";

const themes: Record<ThemeId, Theme> = {
  dark,
  midnight,
  emerald,
};

export const defaultThemeId: ThemeId = "dark";

export function getTheme(id: string | null | undefined): Theme {
  if (id && id in themes) return themes[id as ThemeId];
  return themes[defaultThemeId];
}

export function listThemes(): ThemeSummary[] {
  return Object.values(themes).map(({ id, label, colorScheme }) => ({
    id,
    label,
    colorScheme,
  }));
}

function camelToKebab(key: string): string {
  return key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

function renderCSS(theme: Theme): string {
  const lines = Object.entries(theme.colors).map(
    ([key, value]) => `  --color-${camelToKebab(key)}: ${value};`,
  );
  return `:root{color-scheme:${theme.colorScheme};\n${lines.join("\n")}\n}`;
}

const cssCache = new Map<ThemeId, string>();

export function themeToCSS(theme: Theme): string {
  const cached = cssCache.get(theme.id);
  if (cached) return cached;
  const css = renderCSS(theme);
  cssCache.set(theme.id, css);
  return css;
}

export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme.colors)) {
    root.style.setProperty(`--color-${camelToKebab(key)}`, value);
  }
  root.style.colorScheme = theme.colorScheme;

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta instanceof HTMLMetaElement) {
    meta.content = theme.colors.bg;
  }
}
