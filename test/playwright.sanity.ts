import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  expect: { timeout: 5000 },
  preserveOutput: 'never',
  projects: [
    {
      name: 'sanity',
      use: devices['Desktop Chrome'],
    },
  ],
  reporter: 'list',
  reportSlowTests: null,
  retries: 0,
  timeout: 10 * 60 * 1000,
  testMatch: 'sanity/**',
  use: { trace: 'off' },
});
