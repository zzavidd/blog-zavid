import { defineConfig } from '@playwright/test';

import { prodProjects } from './utils/projects';

export default defineConfig({
  expect: { timeout: 5000 },
  preserveOutput: 'never',
  projects: prodProjects,
  reporter: './utils/reporter.ts',
  reportSlowTests: null,
  retries: 0,
  timeout: 10 * 60 * 1000,
  testMatch: '**/prod/**',
  use: { trace: 'off' },
});
