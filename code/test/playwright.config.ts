import { defineConfig } from '@playwright/test';

import { testProjects } from './utils/projects';

export default defineConfig({
  expect: { timeout: 5000 },
  forbidOnly: !!process.env.CI,
  globalSetup: require.resolve('./utils/setup'),
  outputDir: './results',
  preserveOutput: 'never',
  projects: testProjects,
  quiet: true,
  reporter: process.env.CI
    ? [['list'], ['junit', { outputFile: './results/results.xml' }]]
    : 'list',
  reportSlowTests: null,
  retries: process.env.CI ? 2 : 0,
  testIgnore: '**/prod/**',
  timeout: (process.env.CI ? 30 : 15) * 1000,
  use: {
    baseURL: 'http://localhost:4000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm run dev',
    reuseExistingServer: !process.env.CI,
    url: 'http://localhost:4000',
  },
  workers: process.env.CI ? 4 : 7,
});
