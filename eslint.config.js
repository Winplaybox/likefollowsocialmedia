// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    files: ['**/*.css'],
    plugins: {
      tailwindcss: require('eslint-plugin-tailwindcss'),
    },
    rules: {
      'tailwindcss/no-custom-classname': 'off', // or configure as needed
    },
  },
]);
