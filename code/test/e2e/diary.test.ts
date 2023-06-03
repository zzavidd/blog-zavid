import { expect, test } from '@playwright/test';
import { DiaryStatus } from '@prisma/client';

import { createDiaryEntry } from '../../ops/ingestion/factory';
import prisma from '../../src/server/prisma';
import Settings from '../../src/utils/settings';

const entryNumber = 1;
const diary = createDiaryEntry({ entryNumber });

test.describe('Diary', () => {
  [
    { name: 'can view published page', status: DiaryStatus.PUBLISHED },
    { name: 'can view private page', status: DiaryStatus.PRIVATE },
    {
      name: 'can view protected page',
      status: DiaryStatus.PROTECTED,
      expect404: true,
    },
    { name: 'can view draft page', status: DiaryStatus.DRAFT, expect404: true },
  ].forEach(({ name, status, expect404 }) => {
    test(name, async ({ page }) => {
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
