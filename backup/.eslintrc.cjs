/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: '@zzavidd/eslint-config/node-ts',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  }
};
