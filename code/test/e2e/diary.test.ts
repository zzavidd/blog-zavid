import { expect, test } from '@playwright/test';
import type { Diary } from '@prisma/client';
import { DiaryStatus } from '@prisma/client';

import { createDiaryEntry } from '../../ops/ingestion/factory';
import Settings from '../../src/utils/settings';
import { DIARY_ENTRY_NUMBERS } from '../utils/constants';
import prisma from '../utils/prisma';

test.describe('Diary', () => {
  test.describe.configure({ mode: 'parallel' });

  test.describe('Index', () => {
    test.describe.configure({ mode: 'serial' });

    let latestDiaryEntry: Diary | null;

    test.beforeAll(async () => {
      latestDiaryEntry = await prisma.diary.findFirst({
        orderBy: { entryNumber: 'desc' },
        where: { status: DiaryStatus.PUBLISHED },
      });
      if (!latestDiaryEntry) {
        const diary = createDiaryEntry({
          entryNumber: DIARY_ENTRY_NUMBERS.LATEST_DIARY,
          status: DiaryStatus.PUBLISHED,
        });
        latestDiaryEntry = await prisma.diary.create({ data: diary });
      }
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
    test.describe.configure({ mode: 'parallel' });

    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.getByTestId('zb.accept').click();
    });

    [
      {
        status: DiaryStatus.DRAFT,
        entryNumber: DIARY_ENTRY_NUMBERS.STATUS_DRAFT,
        expect404: true,
      },
      {
        status: DiaryStatus.PROTECTED,
        entryNumber: DIARY_ENTRY_NUMBERS.STATUS_PROTECTED,
        expect404: true,
      },
      {
        status: DiaryStatus.PRIVATE,
        entryNumber: DIARY_ENTRY_NUMBERS.STATUS_PRIVATE,
      },
      {
        status: DiaryStatus.PUBLISHED,
        entryNumber: DIARY_ENTRY_NUMBERS.STATUS_PUBLISHED,
      },
    ].forEach(({ status, entryNumber, expect404 }) => {
      test(`can view ${status} page`, async ({ page }) => {
        const diary = createDiaryEntry({ entryNumber, status });
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
