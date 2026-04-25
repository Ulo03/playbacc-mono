import { defineConfig, presetUno, presetWebFonts } from "unocss";
import extractorSvelte from "@unocss/extractor-svelte";

export default defineConfig({
  extractors: [extractorSvelte()],
  theme: {
    colors: {
      pb: {
        bg: {
          DEFAULT: "var(--color-bg)",
          surface: "var(--color-surface)",
          "surface-hover": "var(--color-surface-hover)",
        },
        border: "var(--color-border)",
        overlay: "var(--color-overlay)",
        primary: {
          DEFAULT: "var(--color-primary)",
          light: "color-mix(in oklab, var(--color-primary), white 25%)",
        },
        text: {
          DEFAULT: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
        },
        danger: "var(--color-danger)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        "focus-ring": "var(--color-focus-ring)",
      },
      spotify: {
        green: "#1DB954",
        white: "#FFFFFF",
        black: "#191414",
      },
    },
    borderRadius: {},
  },
  presets: [
    presetUno(),
    presetWebFonts({
      provider: "bunny",
      fonts: {
        sans: "Inter:400,500,600,700",
        mono: "JetBrains Mono:400,500",
      },
    }),
  ],
});
