import js from "@eslint/js"
import globals from "globals"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import perfectionist from "eslint-plugin-perfectionist"
import tailwind from "eslint-plugin-tailwindcss"
import eslintPluginPrettier from "eslint-plugin-prettier"
import eslintConfigPrettier from "eslint-config-prettier"

export default tseslint.config(
  { ignores: ["dist"] },
  js.configs.recommended, // Base JS rules
  ...tseslint.configs.recommended, // Base TS rules
  ...tseslint.configs.stylistic, // Base Stylistic TS rules

  // Config for TypeScript/TSX files
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.browser, // Spread browser globals
      },
      parserOptions: {
        project: ["./tsconfig.app.json", "./tsconfig.node.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      react: react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      perfectionist: perfectionist,
      tailwind: tailwind,
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react/prop-types": "off",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "perfectionist/sort-imports": [
        "error",
        {
          type: "natural",
          order: "asc",
          groups: ["react", ["builtin", "external"], "internal", ["parent", "sibling", "index"], "side-effect"],
          customGroups: {
            value: { react: ["react", "react-dom", "react-router", "react-router-dom"] },
          },
          newlinesBetween: "always",
        },
      ],
      ...tailwind.configs["flat/recommended"].rules,
      "tailwind/class-order": "off",
    },
    settings: {
      react: { version: "detect" },
    },
  },

  // Config for JavaScript files in scripts/ directory
  {
    files: ["scripts/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module", // Since dev.js uses import/export
      globals: {
        ...globals.node, // Add Node.js globals
      },
    },
    rules: {
      // Add any script-specific rules here if needed
    },
  },

  eslintConfigPrettier // Apply Prettier overrides last
)
