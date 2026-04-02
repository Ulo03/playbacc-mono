import js from "@eslint/js";
import globals from "globals";

import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

import sveltePlugin from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";

import prettier from "eslint-config-prettier";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.output/**",
      "**/.svelte-kit/**",
      "**/coverage/**",
      "**/playwright-report/**",
      "**/.idea/**",

      // Generated i18n runtime (Paraglide)
      "packages/web/src/lib/paraglide/**",
    ],
  },

  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript (non-type-aware, fast)
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,

      // Prefer the TS-aware versions (and avoid false positives)
      "no-unused-vars": "off",
      "no-undef": "off",
    },
  },

  // Package-specific globals
  {
    files: ["packages/api/**/*.{js,ts}", "packages/api/**/*.tsx"],
    languageOptions: {
      globals: {
        ...globals.node,
        Bun: "readonly",
      },
    },
  },
  {
    files: ["packages/web/**/*.{js,ts,svelte}"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  // Svelte
  ...sveltePlugin.configs["flat/recommended"],
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: [".svelte"],
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      // This rule expects SvelteKit typed routes; it doesn't work well with localized/runtime-generated URLs.
      "svelte/no-navigation-without-resolve": "off",
    },
  },

  // Disable rules that conflict with Prettier (keep last)
  prettier,
  ...sveltePlugin.configs["flat/prettier"],
];
