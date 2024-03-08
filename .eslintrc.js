/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: ['@zzavidd/eslint-config/react-ts'],
  ignorePatterns: [
    'ops/backup/**/*.ts',
    '**/bun.lockb',
    '**/schemas/**/*.ts',
    'next-env.d.ts',
  ],
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
    '@typescript-eslint/ban-ts-comment': 'off',
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
