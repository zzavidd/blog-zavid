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
    'require-await': 0,
    'react/react-in-jsx-scope': 0,
    'react-hooks/exhaustive-deps': 0,
    'react-hooks/rules-of-hooks': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-empty-function': 0,
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
