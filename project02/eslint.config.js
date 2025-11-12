import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        sourceType: "module"
      }
    },
    rules: {
      "no-unused-vars": "off",
      "no-unused-private-class-members":"off"
    },
    extends: [js.configs.recommended]
  },

 {
    files: ["test/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.mocha
      },
      parserOptions: {
        sourceType: "module"
      }
    },
    rules: {
      "no-unused-vars": "off"
    }
  }
]);
