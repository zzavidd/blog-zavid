import { expect, test } from '@playwright/test';

import Settings from '../../src/utils/settings';

test.describe.configure({ mode: 'parallel' });
test.describe('Cookies', () => {
  test.skip(({ browserName }) => browserName !== 'chromium');

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('are set to true on allow', async ({ context, page }) => {
    await page.getByTestId('zb.accept').click();

    const cookies = await context.cookies();
    const cookie = cookies.find(({ name }) => name === Settings.COOKIE_NAME);
    expect(cookie).toBeDefined();
    expect(cookie?.value).toBe('true');
  });

  test('are set to false on deny', async ({ context, page }) => {
    await page.getByTestId('zb.deny').click();

    const cookies = await context.cookies();
    const cookie = cookies.find(({ name }) => name === Settings.COOKIE_NAME);
    expect(cookie).toBeDefined();
    expect(cookie?.value).toBe('false');
  });
});
