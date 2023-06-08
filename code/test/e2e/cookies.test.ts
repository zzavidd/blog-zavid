import { expect, test } from '@playwright/test';

import Settings from '../../src/utils/settings';

test.describe('Cookies', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('are set to true on allow', async ({ context, page }) => {
    const acceptButton = page.getByTestId('zb.accept');
    await acceptButton.waitFor({ state: 'visible' });
    await acceptButton.click();

    const cookies = await context.cookies();
    const cookie = cookies.find(({ name }) => name === Settings.COOKIE_NAME);
    expect(cookie).toBeDefined();
    expect(cookie?.value).toBe('true');
  });

  test('are set to false on deny', async ({ context, page }) => {
    const denyButton = page.getByTestId('zb.deny');
    await denyButton.waitFor({ state: 'visible' });
    await denyButton.click();

    const cookies = await context.cookies();
    const cookie = cookies.find(({ name }) => name === Settings.COOKIE_NAME);
    expect(cookie).toBeDefined();
    expect(cookie?.value).toBe('false');
  });
});
