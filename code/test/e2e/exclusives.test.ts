import { faker } from '@faker-js/faker/locale/en_GB';
import { expect, test } from '@playwright/test';
import { PostStatus } from '@prisma/client';

import { createExclusive } from '../../ops/ingestion/factory';
import Settings from '../../src/utils/settings';
import prisma from '../utils/prisma';

const id = 1;
const slug = faker.lorem.slug();
const exclusive = createExclusive({ slug });

test.describe('Exclusive', () => {
  test.describe('Individual', () => {
    test.describe.configure({ mode: 'serial' });
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.getByTestId('zb.accept').click();
    });

    [
      { status: PostStatus.PUBLISHED },
      { status: PostStatus.DRAFT, expect404: true },
    ].forEach(({ status, expect404 }) => {
      test(`can view ${status} page`, async ({ page }) => {
        const payload = { ...exclusive, id, status };
        await prisma.exclusive.upsert({
          create: payload,
          update: payload,
          where: { id },
        });
        await page.goto(`/exclusives/${slug}`);

        const expectedTitle = expect404 ? '404: Not Found' : exclusive.subject;
        await expect(page).toHaveTitle(
          `${expectedTitle} | ${Settings.SITE_TITLE}`,
        );
      });
    });
  });
});
