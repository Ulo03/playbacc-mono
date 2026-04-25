import type { ThemeId } from "@playbacc/shared";

export type { ThemeId };

export type ColorScheme = "light" | "dark";

export type ThemeColors = {
  bg: string;
  surface: string;
  surfaceHover: string;
  overlay: string;
  border: string;

  primary: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  danger: string;
  success: string;
  warning: string;

  focusRing: string;
};

export type Theme = {
  id: ThemeId;
  label: string;
  colorScheme: ColorScheme;
  colors: ThemeColors;
};

export type ThemeSummary = {
  id: ThemeId;
  label: string;
  colorScheme: ColorScheme;
};
