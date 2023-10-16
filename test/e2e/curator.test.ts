import type { Locator } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { DiaryStatus } from '@prisma/client';

import { createDiaryEntry } from '../../ops/ingestion/factory';
import { setConsentCookies } from '../utils/functions';
import prisma from '../utils/prisma';

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

  let entryNumber: number;

  test.beforeAll(async () => {
    const diary = createDiaryEntry({ status: DiaryStatus.PUBLISHED });
    await prisma.diary.create({ data: diary });
    entryNumber = diary.entryNumber;
  });

  test.beforeEach(async ({ baseURL, context, page }) => {
    await setConsentCookies(context, baseURL);
    await page.goto(`/diary/${entryNumber}`);
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
