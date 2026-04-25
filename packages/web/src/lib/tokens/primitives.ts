export const primitives = {
  // neutrals
  black: "#000000",
  white: "#ffffff",
  neutral50: "#fafafa",
  neutral100: "#f5f5f5",
  neutral200: "#e5e5e5",
  neutral300: "#d4d4d4",
  neutral400: "#a3a3a3",
  neutral500: "#737373",
  neutral600: "#525252",
  neutral700: "#404040",
  neutral800: "#262626",
  neutral900: "#171717",
  neutral950: "#0a0a0a",

  // amber (playbacc signature)
  amber300: "#f0be6e",
  amber400: "#e8a849",
  amber500: "#d98e28",

  // blue / purple (midnight)
  indigo200: "#c7d2fe",
  indigo400: "#818cf8",
  indigo500: "#6366f1",
  indigo950: "#0a0f24",
  slate800: "#1e293b",
  slate900: "#0f172a",

  // green (emerald)
  emerald300: "#6ee7b7",
  emerald400: "#34d399",
  emerald500: "#10b981",

  // status
  red400: "#f87171",
  red500: "#ef4444",
  green400: "#4ade80",
  green500: "#22c55e",
  yellow400: "#facc15",
  yellow500: "#eab308",

  // overlays — 8-digit hex (RRGGBBAA), valid in CSS and SVG
  blackA60: "#00000099",
  blackA80: "#000000cc",
  whiteA60: "#ffffff99",
} as const;

export type PrimitiveToken = keyof typeof primitives;
