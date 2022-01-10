module.exports = {
  parserOptions: {
    ecmaVersion: 13,
  },
  extends: ['airbnb-base', 'prettier'],
  rules: {
    'no-console': 'off',
    'lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],
  },
};
