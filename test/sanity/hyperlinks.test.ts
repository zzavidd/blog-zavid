import { capitalize } from '@mui/material';
import { expect, test, type Page } from '@playwright/test';
import type { Diary } from '@prisma/client';
import {
  DiaryStatus,
  PostStatus,
  PostType,
  PrismaClient,
} from '@prisma/client';

import { DOMAINS, formatDiaryEntryTitle } from 'utils/functions';
import logger from 'utils/logger';
import Settings from 'utils/settings';

import { setConsentCookies } from '../utils/functions';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_TEST_URL?.replace('_test', ''),
    },
  },
});

test.use({ baseURL: 'https://zavidegbue.com' });

test.describe('Crawler', () => {
  test.skip(({ browserName }) => browserName !== 'chromium');

  test('crawl diary entries', async ({ baseURL, context, page }) => {
    await setConsentCookies(context, baseURL);

    const entries = await prisma.diary.findMany({
      orderBy: { entryNumber: 'asc' },
      select: {
        entryNumber: true,
        title: true,
      },
      where: { status: DiaryStatus.PUBLISHED },
    });
    const urlList: PageInfo[] = entries.map((entry) => ({
      title: formatDiaryEntryTitle(entry as Diary),
      url: `/diary/${entry.entryNumber}`,
    }));

    await checkHyperlinkHealth(page, urlList);
  });

  test.describe.only('crawl posts', () => {
    Object.values(PostType).forEach((type) => {
      const { singular, collection } = DOMAINS[type];

      test(collection, async ({ baseURL, context, page }) => {
        await setConsentCookies(context, baseURL);

        const posts = await prisma.post.findMany({
          orderBy: { datePublished: 'asc' },
          select: { title: true, slug: true, typeId: true },
          where: { status: PostStatus.PUBLISHED, type },
        });

        const urlList: PageInfo[] = posts.map((post) => ({
          title: `${capitalize(singular)} #${post.typeId}: ${post.title}`,
          url: `/${collection}/${post.slug}`,
        }));

        await checkHyperlinkHealth(page, urlList);
      });
    });
  });
});

async function checkHyperlinkHealth(
  page: Page,
  urlList: PageInfo[],
): Promise<void> {
  let errorCount = 0;
  let totalCount = 0;

  for await (const { title, url } of urlList) {
    await test.step(title, async () => {
      await page.goto(url, { waitUntil: 'networkidle' });
      await expect(page).toHaveTitle(`${title} | ${Settings.SITE_TITLE}`);

      const locators = await page.locator('pre a').all();
      totalCount += locators.length;
      for await (const link of locators) {
        const text = await link.textContent();
        const href = await link.getAttribute('href');
        expect(text).toBeTruthy();
        expect(href).toBeTruthy();

        const message = `Text '${text}' with URL '${href}' failed to navigate.\nSee '${page.url()}'.`;
        try {
          const response = await page.request.get(href!);
          if (!response.ok()) throw new Error();
        } catch (e) {
          errorCount++;
          logger.warn(message);
        }
      }
    });
  }

  const successRate = ((totalCount - errorCount) / totalCount) * 100 || 0;
  const threshold = 90;
  logger.info(`Hyperlink health: ${successRate.toFixed(2)}%`);
  expect(
    successRate,
    `Expected hyperlink health to be greater than ${threshold}% but was ${successRate}%.`,
  ).toBeGreaterThanOrEqual(threshold);
}

interface PageInfo {
  title: string;
  url: string;
}
