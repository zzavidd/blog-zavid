import { expect, test } from '@playwright/test';
import type { Diary } from '@prisma/client';
import { DiaryStatus } from '@prisma/client';

import { createDiaryEntry } from '../../ops/ingestion/factory';
import Settings from '../../src/utils/settings';
import prisma from '../utils/prisma';

test.describe.configure({ mode: 'serial' });
test.describe('Diary', () => {
  test.describe('Index', () => {
    let latestDiaryEntry: Diary | null;

    test.beforeAll(async () => {
      latestDiaryEntry = await prisma.diary.findFirst({
        orderBy: { entryNumber: 'desc' },
        where: { status: DiaryStatus.PUBLISHED },
      });
      expect(latestDiaryEntry).toBeTruthy();
    });

    test.beforeEach(async ({ page }) => {
      await page.goto('/diary');
      await page.getByTestId('zb.accept').click();
    });

    test('has correct page title', async ({ page }) => {
      await expect(page).toHaveTitle(`Diary | ${Settings.SITE_TITLE}`);
    });

    test('has entries listed', async ({ page }) => {
      const { entryNumber, title } = latestDiaryEntry!;
      const h2 = page.getByTestId(`zb.entry.${entryNumber}`);
      await expect(h2).toHaveText(`Diary Entry #${entryNumber}:${title}`);
    });

    test('can click to individual page', async ({ page }) => {
      const { entryNumber, title } = latestDiaryEntry!;
      await page.getByTestId(`zb.readmore.${entryNumber}`).click();
      await page.waitForURL(`/diary/${entryNumber}`);
      await expect(page).toHaveTitle(
        `Diary Entry #${entryNumber}: ${title} | ${Settings.SITE_TITLE}`,
      );
    });
  });

  test.describe('Individual', () => {
    test.describe.configure({ mode: 'serial' });
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.getByTestId('zb.accept').click();
    });

    [
      { status: DiaryStatus.PUBLISHED },
      { status: DiaryStatus.PRIVATE },
      { status: DiaryStatus.PROTECTED, expect404: true },
      { status: DiaryStatus.DRAFT, expect404: true },
    ].forEach(({ status, expect404 }) => {
      test(`can view ${status} page`, async ({ page }) => {
        const diary = createDiaryEntry({ status });
        await prisma.diary.create({ data: diary });
        await page.goto(`/diary/${diary.entryNumber}`);

        const expectedTitle = expect404
          ? '404: Not Found'
          : `Diary Entry #${diary.entryNumber}: ${diary.title}`;

        await expect(page).toHaveTitle(
          `${expectedTitle} | ${Settings.SITE_TITLE}`,
        );
      });
    });
  });
});
