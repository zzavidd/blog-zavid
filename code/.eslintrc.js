/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: '@zzavidd/eslint-config/react-ts',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['**/tsconfig.json'],
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 0,
    // 'react-hooks/exhaustive-deps': 0,
    // 'react-hooks/rules-of-hooks': 0,
    'react/react-in-jsx-scope': 0,
    'spaced-comment': 0,
    'semi': 0,
    'quotes': ['warn', 'single', { avoidEscape: true }],
  },
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        '@typescript-eslint/no-floating-promises': 'warn',
      },
    },
    {
      files: ['**/wishlist/**'],
      rules: {
        'react-hooks/exhaustive-deps': 1,
        'react-hooks/rules-of-hooks': 1,
      },
    },
  ],
};
