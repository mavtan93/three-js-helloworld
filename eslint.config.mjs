import { defineConfig } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    extends: compat.extends("plugin:prettier/recommended"),

    rules: {
      "no-console": "warn",

      "no-restricted-syntax": [
        "error",
        {
          selector:
            "MemberExpression[object.name='geometry'] > Identifier[name='dispose']",
          message: "Always call geometry.dispose() when removing a mesh.",
        },
        {
          selector:
            "MemberExpression[object.name='material'] > Identifier[name='dispose']",
          message: "Always call material.dispose() when no longer needed.",
        },
      ],

      "no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^(THREE|geometry|material|texture)$",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
]);
