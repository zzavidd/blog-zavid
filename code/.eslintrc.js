/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: ['@zzavidd/eslint-config/react-ts'],
  ignorePatterns: ['**/schemas/**/*.ts'],
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
    'react/react-in-jsx-scope': 'off',
    'quotes': ['warn', 'single', { avoidEscape: true }],
    'no-only-tests/no-only-tests': 'warn',
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
