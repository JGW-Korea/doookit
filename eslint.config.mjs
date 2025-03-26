import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";
import htmlPlugin from "eslint-plugin-html";
import cssModulesPlugin from "eslint-plugin-css-modules";

export default [
  {
    ignores: ["**/node_modules/**", "**/dist/**", "**/*.scss"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      prettier: prettierPlugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      "prettier/prettier": "error",
    },
  },
  {
    files: ["**/*.html"],
    plugins: {
      html: htmlPlugin,
    },
    rules: {
      // 필요시 추가 가능
    },
  },
  {
    files: ["**/*.scss"],
    plugins: {
      "css-modules": cssModulesPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      "css-modules/no-unused-class": "warn",
      "css-modules/no-undef-class": "error",
      "prettier/prettier": "error",
    },
  },
];
