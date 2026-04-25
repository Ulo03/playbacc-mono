import { primitives as p } from "../primitives";
import type { Theme } from "../types";

export const midnight: Theme = {
  id: "midnight",
  label: "Midnight",
  colorScheme: "dark",
  colors: {
    bg: p.indigo950,
    surface: p.slate900,
    surfaceHover: p.slate800,
    overlay: p.blackA80,
    border: p.slate800,

    primary: p.indigo400,

    textPrimary: p.neutral50,
    textSecondary: p.indigo200,
    textMuted: p.neutral500,

    danger: p.red400,
    success: p.green400,
    warning: p.yellow400,

    focusRing: p.indigo400,
  },
};
