/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: ['@zzavidd/eslint-config/react-ts'],
  ignorePatterns: ['**/schemas/**/*.ts'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['**/tsconfig.json'],
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
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
