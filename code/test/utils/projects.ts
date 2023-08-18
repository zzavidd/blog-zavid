import type { Project } from '@playwright/test';
import { devices } from '@playwright/test';

export const testProjects: Project[] = [
  {
    name: 'chromium',
    use: devices['Desktop Chrome'],
  },
  {
    name: 'firefox',
    testMatch: ['**/curator.test.ts'],
    use: devices['Desktop Firefox'],
  },
  {
    name: 'webkit',
    testMatch: ['**/curator.test.ts'],
    use: devices['Desktop Safari'],
  },
  {
    name: 'Mobile Chrome',
    testMatch: ['**/curator.test.ts'],
    retries: 5,
    use: devices['Pixel 5'],
  },
  {
    name: 'Mobile Safari',
    testMatch: ['**/curator.test.ts'],
    retries: 5,
    use: devices['iPhone 12'],
  },
];

export const prodProjects: Project[] = [
  {
    name: 'production',
    use: devices['Desktop Chrome'],
    testMatch: ['**/prod/**'],
  },
];
