import type { Locator } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { DiaryStatus } from '@prisma/client';

import { createDiaryEntry } from '../../ops/ingestion/factory';
import { DIARY_ENTRY_NUMBERS } from '../utils/constants';
import prisma from '../utils/prisma';

const entryNumber = DIARY_ENTRY_NUMBERS.CURATOR;
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
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async () => {
    const diary = createDiaryEntry({
      entryNumber,
      status: DiaryStatus.PUBLISHED,
    });
    await prisma.diary.create({ data: diary });
  });

  test.beforeEach(async ({ page }) => {
    await page.goto(`/diary/${entryNumber}`);
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
