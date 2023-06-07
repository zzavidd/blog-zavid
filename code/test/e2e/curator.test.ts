import type { Locator } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { DiaryStatus } from '@prisma/client';

import { createDiaryEntry } from '../../ops/ingestion/factory';
import prisma from '../../src/server/prisma';

const entryNumber = 1;
const diary = createDiaryEntry({ entryNumber, status: DiaryStatus.PUBLISHED });

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
  test.beforeAll(async () => {
    await prisma.diary.upsert({
      create: diary,
      update: diary,
      where: { entryNumber },
    });
  });

  test.beforeEach(async ({ page }) => {
    await page.goto(`/diary/${entryNumber}`);
    await page.getByTestId('zb.accept').click();
  });

  params.forEach(({ name, skipCondition, clickOptions }) => {
    test.describe(name, () => {
      test.skip(({ isMobile }) => skipCondition(isMobile));

      test('has image', async ({ page }) => {
        await page.getByTestId('zb.diary.content.0').click(clickOptions);
        const curateButton = page.getByTestId('zb.curate');
        await curateButton.waitFor({ state: 'visible' });
        await curateButton.click();

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
