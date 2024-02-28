const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

module.exports = {
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/no-shadow": "off",
    "import/no-default-export": "off",
    "react/jsx-sort-props": "off",
    "unicorn/filename-case": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "tsdoc/syntax": "off",
  },
};
