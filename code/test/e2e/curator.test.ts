import type { Locator } from '@playwright/test';
import { DiaryStatus } from '@prisma/client';

import { createDiaryEntry } from '../../ops/ingestion/factory';
import prisma from '../../src/server/prisma';
import { expect, test } from '../fixtures';

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

  test.beforeEach(async ({ zPage }) => {
    await zPage.goto(`/diary/${entryNumber}`);
  });

  params.forEach(({ name, skipCondition, clickOptions }) => {
    test.describe(name, () => {
      test.skip(({ isMobile }) => skipCondition(isMobile));

      test('has image', async ({ zPage }) => {
        await zPage.getByTestId('zb.diary.content.0').click(clickOptions);
        const curateButton = zPage.getByTestId('zb.curate');
        await curateButton.click();

        const image = zPage.getByTestId('zb.curator.image');
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