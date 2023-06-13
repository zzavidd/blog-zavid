import type { Project } from '@playwright/test';
import { devices } from '@playwright/test';

const projects: Project[] = [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
  },
  {
    name: 'Mobile Chrome',
    testMatch: ['**/curator.test.ts'],
    retries: 5,
    use: { ...devices['Pixel 5'] },
  },
  {
    name: 'Mobile Safari',
    testMatch: ['**/curator.test.ts'],
    retries: 5,
    use: { ...devices['iPhone 12'] },
  },
];

export default projects;
