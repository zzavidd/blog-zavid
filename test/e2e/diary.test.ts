import { expect, test } from '@playwright/test';
import type { Diary } from '@prisma/client';
import { DiaryStatus } from '@prisma/client';

import { createDiaryEntry } from '../../ops/ingestion/factory';
import Settings from '../../src/utils/settings';
import { setConsentCookies } from '../utils/functions';
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
          entryNumber: 2 ** 11,
          status: DiaryStatus.PUBLISHED,
        });
        latestDiaryEntry = await prisma.diary.create({ data: diary });
      }
    });

    test.beforeEach(async ({ baseURL, context, page }) => {
      await setConsentCookies(context, baseURL);
      await page.goto('/diary');
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

    test.beforeEach(async ({ baseURL, context }) => {
      await setConsentCookies(context, baseURL);
    });

    [
      { status: DiaryStatus.DRAFT, expect404: true },
      { status: DiaryStatus.PROTECTED, expect404: true },
      { status: DiaryStatus.PRIVATE },
      { status: DiaryStatus.PUBLISHED },
    ].forEach(({ status, expect404 }) => {
      test(`can view ${status} page`, async ({ page }) => {
        const diary = createDiaryEntry({ status });
        await prisma.diary.create({ data: diary });
        await page.goto(`/diary/${diary.entryNumber}`);

        const expectedTitle = expect404
          ? '404: Not Found'
          : `Diary Entry #${diary.entryNumber}: ${diary.title} | ${Settings.SITE_TITLE}`;

        await expect(page).toHaveTitle(expectedTitle);
      });
    });
  });
});
