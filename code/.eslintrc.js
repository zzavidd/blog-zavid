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
    'react-hooks/exhaustive-deps': 0,
    'react-hooks/rules-of-hooks': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    'spaced-comment': 0,
    'quotes': ['warn', 'single', { avoidEscape: true }],
  },
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        '@typescript-eslint/no-floating-promises': 'warn',
      },
    },
    // {
    //   files: ['*.ts'],
    //   rules: {
    //     'func-style': [
    //       'warn',
    //       'declaration',
    //       {
    //         allowArrowFunctions: false,
    //       },
    //     ],
    //   },
    // },
  ],
};
