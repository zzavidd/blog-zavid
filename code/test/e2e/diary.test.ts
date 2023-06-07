import type { Diary } from '@prisma/client';
import { DiaryStatus } from '@prisma/client';

import { createDiaryEntry } from '../../ops/ingestion/factory';
import prisma from '../../src/server/prisma';
import Settings from '../../src/utils/settings';
import { expect, test } from '../fixtures';

const entryNumber = 1;
const diary = createDiaryEntry({ entryNumber });

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

    test.beforeEach(async ({ zPage }) => {
      await zPage.goto('/diary');
    });

    test('has correct page title', async ({ zPage }) => {
      await expect(zPage).toHaveTitle(`Diary | ${Settings.SITE_TITLE}`);
    });

    test('has entries listed', async ({ zPage }) => {
      const { entryNumber, title } = latestDiaryEntry!;
      const h2 = zPage.getByTestId(`zb.entry.${entryNumber}`);
      await expect(h2).toHaveText(`Diary Entry #${entryNumber}: ${title}`);
    });

    test('can click to individual page', async ({ zPage }) => {
      const { entryNumber, title } = latestDiaryEntry!;
      await zPage.getByTestId(`zb.readmore.${entryNumber}`).click();
      await zPage.waitForURL(`/diary/${entryNumber}`);
      await expect(zPage).toHaveTitle(
        `Diary Entry #${entryNumber}: ${title} | ${Settings.SITE_TITLE}`,
      );
    });
  });

  test.describe('Individual', () => {
    [
      { status: DiaryStatus.PUBLISHED },
      { status: DiaryStatus.PRIVATE },
      { status: DiaryStatus.PROTECTED, expect404: true },
      { status: DiaryStatus.DRAFT, expect404: true },
    ].forEach(({ status, expect404 }) => {
      test(`can view ${status} page`, async ({ zPage }) => {
        diary.status = status;
        await prisma.diary.upsert({
          create: diary,
          update: diary,
          where: { entryNumber },
        });
        await zPage.goto('/diary/1');

        const expectedTitle = expect404
          ? '404: Not Found'
          : `Diary Entry #${diary.entryNumber}: ${diary.title}`;

        await expect(zPage).toHaveTitle(
          `${expectedTitle} | ${Settings.SITE_TITLE}`,
        );
      });
    });
  });
});
