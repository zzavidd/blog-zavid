import { capitalize } from '@mui/material';
import { expect, test } from '@playwright/test';
import type { Diary } from '@prisma/client';
import { DiaryStatus, PostType, PrismaClient } from '@prisma/client';

import { DOMAINS, formatDiaryEntryTitle } from 'utils/functions';
import Settings from 'utils/settings';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_TEST_URL?.replace('_test', ''),
    },
  },
});

test.use({ baseURL: 'https://zavidegbue.com' });
test.describe.configure({ timeout: 60 * 1000 });

test.describe('Crawler', () => {
  test.skip(({ browserName }) => browserName !== 'chromium');

  test('crawl diary entries', async ({ page }) => {
    const entries = await prisma.diary.findMany({
      orderBy: { entryNumber: 'asc' },
      select: {
        entryNumber: true,
        title: true,
      },
      where: { status: DiaryStatus.PUBLISHED },
    });

    for await (const entry of entries) {
      const title = formatDiaryEntryTitle(entry as Diary);
      await test.step(title, async () => {
        await page.goto(`/diary/${entry.entryNumber}`);
        await expect(page).toHaveTitle(`${title} | ${Settings.SITE_TITLE}`);

        for await (const link of await page.locator('pre a').all()) {
          const text = await link.textContent();
          const href = await link.getAttribute('href');
          expect(text).toBeTruthy();
          expect(href).toBeTruthy();

          const message = `Text '${text}' with URL '${href}' failed to navigate.\nSee ${page.url()}.`;
          try {
            const response = await page.request.get(href!);
            expect.soft(response.ok(), { message }).toBe(true);
          } catch (e) {
            expect.soft(false, { message }).toBe(true);
          }
        }
      });
    }
  });

  test.describe('crawl posts', () => {
    Object.values(PostType).forEach((type) => {
      const { singular, collection } = DOMAINS[type];

      test(collection, async ({ page }) => {
        const posts = await prisma.post.findMany({
          orderBy: { datePublished: 'asc' },
          select: { title: true, slug: true },
          where: { status: DiaryStatus.PUBLISHED, type },
        });

        let index = 0;

        for await (const post of posts) {
          index++;
          const title = `${capitalize(singular)} #${index}: ${post.title}`;
          await test.step(title, async () => {
            await page.goto(`/${collection}/${post.title}`);
            await expect(page).toHaveTitle(`${title} | ${Settings.SITE_TITLE}`);

            for await (const link of await page.locator('pre a').all()) {
              const text = await link.textContent();
              const href = await link.getAttribute('href');
              expect(text).toBeTruthy();
              expect(href).toBeTruthy();

              const message = `Text '${text}' with URL '${href}' failed to navigate.\nSee ${page.url()}.`;
              try {
                const response = await page.request.get(href!);
                expect.soft(response.ok(), { message }).toBe(true);
              } catch (e) {
                expect.soft(false, { message }).toBe(true);
              }
            }
          });
        }
      });
    });
  });
});
