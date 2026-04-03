import { defineConfig, presetUno, presetWebFonts } from "unocss";
import extractorSvelte from "@unocss/extractor-svelte";

export default defineConfig({
  extractors: [extractorSvelte()],
  theme: {
    colors: {
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
