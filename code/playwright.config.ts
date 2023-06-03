import type { Project } from '@playwright/test';
import { defineConfig, devices } from '@playwright/test';

const projects: Project[] = [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  // {
  //   name: 'firefox',
  //   use: { ...devices['Desktop Firefox'] },
  // },
  // {
  //   name: 'webkit',
  //   use: { ...devices['Desktop Safari'] },
  // },
  // {
  //   name: 'Mobile Chrome',
  //   use: { ...devices['Pixel 5'] },
  // },
  // {
  //   name: 'Mobile Safari',
  //   use: { ...devices['iPhone 12'] },
  // },
];

export default defineConfig({
  expect: {
    timeout: 1000,
  },
  forbidOnly: !!process.env.CI,
  // fullyParallel: true,
  outputDir: './test/results',
  preserveOutput: 'never',
  projects,
  // reporter: 'html',
  retries: process.env.CI ? 2 : 0,
  testDir: './test',
  timeout: 5 * 1000,
  use: {
    baseURL: 'http://localhost:4000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:4000',
    reuseExistingServer: !process.env.CI,
  },
  workers: process.env.CI ? 1 : undefined,
});