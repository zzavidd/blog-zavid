import { defineConfig } from '@playwright/test';
import 'dotenv/config';

import { testProjects } from './utils/projects';

export default defineConfig({
  expect: { timeout: 5000 },
  forbidOnly: !!process.env.CI,
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
  testDir: '.',
  timeout: (process.env.CI ? 3 : 1) * 60 * 1000,
  use: {
    baseURL: 'http://localhost:4000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm run dev',
    env: { DATABASE_URL: process.env.DATABASE_TEST_URL! },
    reuseExistingServer: !process.env.CI,
    url: 'http://localhost:4000',
    stdout: 'ignore',
  },
  workers: process.env.CI ? 4 : undefined,
});
