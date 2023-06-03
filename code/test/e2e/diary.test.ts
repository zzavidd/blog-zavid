import { expect, test } from '@playwright/test';
import { DiaryStatus } from '@prisma/client';

import { createDiaryEntry } from '../../ops/ingestion/factory';
import prisma from '../../src/server/prisma';
import Settings from '../../src/utils/settings';

const entryNumber = 1;
const diary = createDiaryEntry({ entryNumber });

test.describe('Diary', () => {
  [
    { status: DiaryStatus.PUBLISHED },
    { status: DiaryStatus.PRIVATE },
    { status: DiaryStatus.PROTECTED, expect404: true },
    { status: DiaryStatus.DRAFT, expect404: true },
  ].forEach(({ status, expect404 }) => {
    test(`can view ${status} page`, async ({ page }) => {
      diary.status = status;
      await prisma.diary.upsert({
        create: diary,
        update: diary,
        where: { entryNumber },
      });
      await page.goto('/diary/1');
      await page.getByTestId('zb.accept').click();

      const expectedTitle = expect404
        ? '404: Not Found'
        : `Diary Entry #${diary.entryNumber}: ${diary.title}`;

      await expect(page).toHaveTitle(
        `${expectedTitle} | ${Settings.SITE_TITLE}`,
      );
    });
  });
});
