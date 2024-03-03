/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');
/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'vue/multi-word-component-names': 'off',
  },
};

module.exports = config;
