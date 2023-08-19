import type { Locator } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { DIARY_ENTRY_NUMBERS } from '../utils/constants';

const params: TestDefinition[] = [
  {
    name: 'on mobile',
    skipCondition: (isMobile) => !isMobile,
    clickOptions: { button: 'right', delay: 2500 },
  },
  {
    name: 'on desktop',
    skipCondition: (isMobile) => isMobile,
    clickOptions: { button: 'right' },
  },
];

test.describe('Curator', () => {
  test.describe.configure({ mode: 'parallel' });

  test.beforeEach(async ({ page }) => {
    await page.goto(`/diary/${DIARY_ENTRY_NUMBERS.CURATOR}`);
    await page.getByTestId('zb.accept').click();
  });

  params.forEach(({ name, skipCondition, clickOptions }) => {
    test.describe(name, () => {
      test.skip(({ isMobile }) => skipCondition(isMobile));

      test('has image', async ({ page }) => {
        await page.getByTestId('zb.content.0').click(clickOptions);
        await page.getByTestId('zb.curate').click();

        const image = page.getByTestId('zb.curator.image');
        await expect(image).toBeVisible();
        await expect(image).toHaveAttribute('src', /data.*/);
      });
    });
  });
});

interface TestDefinition {
  name: string;
  skipCondition: (isMobile: boolean) => boolean;
  clickOptions: Parameters<Locator['click']>[0];
}
