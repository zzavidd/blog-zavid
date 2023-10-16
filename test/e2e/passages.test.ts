import { expect, test } from '@playwright/test';
import { PostStatus, PostType } from '@prisma/client';

import { createPost } from '../../ops/ingestion/factory';
import Settings from '../../src/utils/settings';
import { setConsentCookies } from '../utils/functions';
import prisma from '../utils/prisma';

test.describe('Passage', () => {
  test.describe.configure({ mode: 'parallel' });

  test.describe('Individual', () => {
    test.beforeEach(async ({ baseURL, context }) => {
      await setConsentCookies(context, baseURL);
    });

    [
      { status: PostStatus.PUBLISHED, expect404: true },
      { status: PostStatus.PRIVATE },
      { status: PostStatus.PROTECTED, expect404: true },
      { status: PostStatus.DRAFT, expect404: true },
    ].forEach(({ status, expect404 }) => {
      test(`can view ${status} page`, async ({ page }) => {
        const passage = createPost({ status, type: PostType.PASSAGE });
        await prisma.post.create({ data: passage });
        await page.goto(`/passages/${passage.slug}`);

        const expectedTitle = expect404
          ? '404: Not Found'
          : `${passage.title}  | ${Settings.SITE_TITLE}`;
        await expect(page).toHaveTitle(expectedTitle);
      });
    });
  });
});
