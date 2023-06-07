import type { Page } from '@playwright/test';
import { test as base } from '@playwright/test';

export const test = base.extend<Fixtures>({
  zPage: async ({ page }, use) => {
    await page.goto('/');
    const acceptButton = page.getByTestId('zb.accept');
    await acceptButton.waitFor({ state: 'visible' });
    await acceptButton.click();

    await use(page);
  },
});

export { expect } from '@playwright/test';

interface Fixtures {
  zPage: Page;
}
