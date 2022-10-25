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
    '@typescript-eslint/explicit-function-return-type': 0,
    'react/react-in-jsx-scope': 0,
    'spaced-comment': 0,
    'semi': 0,
    'quotes': ['warn', 'single', { avoidEscape: true }],
  },
};
