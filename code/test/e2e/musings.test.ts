import { faker } from '@faker-js/faker/locale/en_GB';
import { expect, test } from '@playwright/test';
import { PostStatus, PostType } from '@prisma/client';

import { createPost } from '../../ops/ingestion/factory';
import Settings from '../../src/utils/settings';
import prisma from '../utils/prisma';

const id = 1;
const slug = faker.lorem.slug();
const passage = createPost({ slug, type: PostType.MUSING }, 'poem');

test.describe('Musing', () => {
  test.describe('Individual', () => {
    test.describe.configure({ mode: 'serial' });
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.getByTestId('zb.accept').click();
    });

    [
      { status: PostStatus.PUBLISHED },
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
        await page.goto(`/musings/${slug}`);

        const expectedTitle = expect404 ? '404: Not Found' : passage.title;
        await expect(page).toHaveTitle(
          `${expectedTitle} | ${Settings.SITE_TITLE}`,
        );
      });
    });
  });
});