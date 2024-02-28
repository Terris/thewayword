/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@config/eslint-config/next.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  ignorePatterns: [".eslintrc.js", "postcss.config.js"],
};
