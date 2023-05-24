/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: ['next/core-web-vitals', '@zzavidd/eslint-config/react-ts'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['**/tsconfig.json'],
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    // 'spaced-comment': 0,
    // 'semi': 0,
    'quotes': ['warn', 'single', { avoidEscape: true }],
  },
  overrides: [
    {
      files: ['**/pages/**/*.tsx'],
      rules: {
        'react/function-component-definition': 'off',
      },
    },
  ],
};
