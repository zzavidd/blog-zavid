import type { Project } from '@playwright/test';
import { devices } from '@playwright/test';

export const testProjects: Project[] = [
  { name: 'setup', testMatch: /.*\.setup\.ts/ },
  {
    name: 'chromium',
    use: devices['Desktop Chrome'],
    dependencies: ['setup'],
  },
  {
    name: 'firefox',
    testMatch: ['**/curator.test.ts'],
    use: devices['Desktop Firefox'],
    dependencies: ['setup'],
  },
  {
    name: 'webkit',
    testMatch: ['**/curator.test.ts'],
    use: devices['Desktop Safari'],
    dependencies: ['setup'],
  },
  {
    name: 'Mobile Chrome',
    testMatch: ['**/curator.test.ts'],
    retries: 5,
    use: devices['Pixel 5'],
    dependencies: ['setup'],
  },
  {
    name: 'Mobile Safari',
    testMatch: ['**/curator.test.ts'],
    retries: 5,
    use: devices['iPhone 12'],
    dependencies: ['setup'],
  },
];

export const prodProjects: Project[] = [
  {
    name: 'production',
    use: devices['Desktop Chrome'],
    testMatch: ['**/prod/**'],
  },
];
