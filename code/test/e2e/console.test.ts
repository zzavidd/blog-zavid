import type { ConsoleMessage } from '@playwright/test';
import { expect, test } from '@playwright/test';

test.describe('Console', () => {
  const errors: ConsoleMessage[] = [];

  test.beforeEach(({ page }) => {
    page.on('console', (message) => {
      if (message.type() === 'error') {
        errors.push(message);
      }
    });
  });

  [
    { name: 'home', href: '/' },
    { name: 'diary index', href: '/diary' },
    { name: 'diary entry', href: '/diary/1' },
    { name: 'about', href: '/about' },
    { name: 'subscribe', href: '/subscribe' },
    { name: 'privacy', href: '/privacy' },
    { name: 'cookies', href: '/cookies' },
  ].forEach(({ name, href }) => {
    test(`has no errors on ${name} page`, async ({ page }) => {
      await page.goto(href);
      expect(errors).toHaveLength(0);
    });
  });
});
