import { expect, test } from '@playwright/test';
import { PostStatus } from '@prisma/client';

import { createExclusive } from '../../ops/ingestion/factory';
import Settings from '../../src/utils/settings';
import prisma from '../utils/prisma';

test.describe('Exclusive', () => {
  test.describe.configure({ mode: 'parallel' });

  test.describe('Individual', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.getByTestId('zb.accept').click();
    });

    [
      { status: PostStatus.PUBLISHED },
      { status: PostStatus.DRAFT, expect404: true },
    ].forEach(({ status, expect404 }) => {
      test(`can view ${status} page`, async ({ page }) => {
        const payload = createExclusive({ status });
        const exclusive = await prisma.exclusive.create({ data: payload });
        await page.goto(`/exclusives/${exclusive.slug}`);

        const expectedTitle = expect404 ? '404: Not Found' : exclusive.subject;
        await expect(page).toHaveTitle(
          `${expectedTitle} | ${Settings.SITE_TITLE}`,
        );
      });
    });
  });
});
