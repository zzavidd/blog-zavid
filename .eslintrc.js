/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: ['@zzavidd/eslint-config/react-ts'],
  ignorePatterns: ['**/schemas/**/*.ts', 'next-env.d.ts'],
  plugins: ['no-only-tests'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['**/tsconfig.json'],
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: ['**/tsconfig.json'],
      },
    },
  },
  rules: {
    'no-only-tests/no-only-tests': 'warn',
    'react/react-in-jsx-scope': 'off',
    'quotes': ['warn', 'single', { avoidEscape: true }],
    'spaced-comment': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      { fixStyle: 'inline-type-imports' },
    ],
    'import/no-unresolved': ['error', { ignore: ['bun:test'] }],
  },
  overrides: [
    {
      files: ['*.test.ts'],
      rules: {
        'no-empty-pattern': 'off',
      },
    },
    {
      files: ['**/pages/**/*.tsx'],
      rules: {
        'react/function-component-definition': 'off',
      },
    },
  ],
};
