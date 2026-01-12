// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    files: ["**/*.css"],
    plugins: {
      tailwindcss: require("eslint-plugin-tailwindcss"),
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
    },
    extends: [
      "plugin:@typescript-eslint/recommended",
      "prettier",
      "plugin:prettier/recommended",
    ],
    rules: {
      "tailwindcss/no-custom-classname": "off", // or configure as needed
      "no-alert": "off",
      "no-console": "off",
      "comma-dangle": "off",
      "function-paren-newline": "off",
      "global-require": "off",
      "import/no-dynamic-require": "off",
      "no-inner-declarations": "off",
      "class-methods-use-this": "off",
      "import/extensions": "off",
      "import/prefer-default-export": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
]);
