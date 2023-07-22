import { faker } from '@faker-js/faker/locale/en_GB';
import { expect, test } from '@playwright/test';
import { PostStatus, PostType } from '@prisma/client';

import { createPost } from '../../ops/ingestion/factory';
import prisma from '../../src/server/prisma';
import Settings from '../../src/utils/settings';

const id = 1;
const slug = faker.lorem.slug();
const passage = createPost({
  slug,
  type: PostType.PASSAGE,
});

test.describe('Passage', () => {
  test.skip(({ browserName }) => browserName !== 'chromium');

  test.describe('Individual', () => {
    test.describe.configure({ mode: 'serial' });
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.getByTestId('zb.accept').click();
    });

    [
      { status: PostStatus.PUBLISHED, expect404: true },
      { status: PostStatus.PRIVATE },
      { status: PostStatus.PROTECTED, expect404: true },
      { status: PostStatus.DRAFT, expect404: true },
    ].forEach(({ status, expect404 }) => {
      test(`can view ${status} page`, async ({ page }) => {
        const payload = { ...passage, id, status };
        await prisma.post.upsert({
          create: payload,
          update: payload,
          where: { id },
        });
        await page.goto(`/passages/${slug}`);

        const expectedTitle = expect404 ? '404: Not Found' : passage.title;
        await expect(page).toHaveTitle(
          `${expectedTitle} | ${Settings.SITE_TITLE}`,
        );
      });
    });
  });
});