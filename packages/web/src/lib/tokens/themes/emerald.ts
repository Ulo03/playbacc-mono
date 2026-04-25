import { primitives as p } from "../primitives";
import type { Theme } from "../types";

export const emerald: Theme = {
  id: "emerald",
  label: "Emerald",
  colorScheme: "dark",
  colors: {
    bg: p.neutral950,
    surface: p.neutral900,
    surfaceHover: p.neutral800,
    overlay: p.blackA80,
    border: p.neutral800,

    primary: p.emerald400,

    textPrimary: p.neutral50,
    textSecondary: p.emerald300,
    textMuted: p.neutral500,

    danger: p.red400,
    success: p.green400,
    warning: p.yellow400,

    focusRing: p.emerald400,
  },
};
