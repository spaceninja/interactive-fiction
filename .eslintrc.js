module.exports = {
  env: {
    node: true,
  },
  parserOptions: {
    ecmaVersion: 13,
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'prettier'],
  rules: {
    'no-console': 'off',
    'lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],
  },
  overrides: [
    {
      // HACK: https://github.com/vuejs/eslint-plugin-vue/issues/1355
      files: ['**/*.html'],
      rules: { 'vue/comment-directive': 'off' },
    },
  ],
};