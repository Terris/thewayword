/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@config/eslint-config/react.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};
