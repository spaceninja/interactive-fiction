module.exports = {
  extends: [
    'stylelint-config-spaceninja',
    'stylelint-config-recommended-vue',
    'stylelint-config-prettier',
  ],
  rules: {
    'a11y/no-outline-none': null,
    'no-descending-specificity': null,
  },
};
