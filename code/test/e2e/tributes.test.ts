import { expect, test } from '@playwright/test';
import { PostStatus, PostType } from '@prisma/client';

import { createPost } from '../../ops/ingestion/factory';
import prisma from '../../src/server/prisma';
import Settings from '../../src/utils/settings';

test.describe('Tributes', () => {
  test.describe.configure({ mode: 'parallel' });

  test.describe('Individual', () => {
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
        const tribute = createPost({ status, type: PostType.ADDENDUM });
        await prisma.post.create({ data: tribute });
        await page.goto(`/tributes/${tribute.slug}`);

        const expectedTitle = expect404 ? '404: Not Found' : tribute.title;
        await expect(page).toHaveTitle(
          `${expectedTitle} | ${Settings.SITE_TITLE}`,
        );
      });
    });
  });
});
