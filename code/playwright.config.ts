import { defineConfig } from '@playwright/test';

import projects from './test/projects';

export default defineConfig({
  expect: { timeout: 5000 },
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  outputDir: './test/results',
  preserveOutput: 'never',
  projects,
  quiet: true,
  reporter: process.env.CI
    ? [['list'], ['junit', { outputFile: './test/results/results.xml' }]]
    : [['list']],
  retries: process.env.CI ? 2 : 0,
  testDir: './test',
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
  workers: process.env.CI ? 1 : 7,
});
