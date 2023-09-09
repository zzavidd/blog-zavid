import type { Project } from '@playwright/test';
import { devices } from '@playwright/test';

export const testProjects: Project[] = [
  {
    name: 'setup',
    testMatch: ['test/utils/setup.ts'],
  },
  {
    name: 'chromium',
    use: devices['Desktop Chrome'],
    testMatch: ['e2e/**'],
    dependencies: ['setup'],
  },
  {
    name: 'firefox',
    use: devices['Desktop Firefox'],
    testMatch: ['e2e/curator.test.ts'],
    dependencies: ['setup'],
  },
  {
    name: 'webkit',
    testMatch: ['e2e/curator.test.ts'],
    use: devices['Desktop Safari'],
    dependencies: ['setup'],
  },
  {
    name: 'Mobile Chrome',
    use: devices['Pixel 5'],
    testMatch: ['e2e/curator.test.ts'],
    dependencies: ['setup'],
    retries: process.env.CI ? 2 : 0,
  },
  {
    name: 'Mobile Safari',
    use: devices['iPhone 12'],
    testMatch: ['e2e/curator.test.ts'],
    dependencies: ['setup'],
    retries: process.env.CI ? 2 : 0,
  },
];

export const prodProjects: Project[] = [
  {
    name: 'production',
    use: devices['Desktop Chrome'],
    testMatch: ['**/prod/**'],
  },
];
