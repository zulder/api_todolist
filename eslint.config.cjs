const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const prettierPlugin = require("eslint-plugin-prettier");

module.exports = [
  {
    ignores: ["node_modules/", "dist/", "build/"], // Arquivos ou pastas a ignorar
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierPlugin.configs.recommended.rules,
      "prettier/prettier": "error",
      "@typescript-eslint/no-unused-vars": ["warn"],
      "no-console": "warn",
    },
  },
];
