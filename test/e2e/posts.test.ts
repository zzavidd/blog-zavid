import { capitalize } from '@mui/material';
import { expect, test } from '@playwright/test';
import { PostStatus, PostType } from '@prisma/client';

import { DOMAINS } from 'utils/functions';

import { createPost } from '../../ops/ingestion/factory';
import Settings from '../../src/utils/settings';
import { setConsentCookies } from '../utils/functions';
import prisma from '../utils/prisma';

const TYPES = [PostType.REVERIE, PostType.EPISTLE, PostType.MUSING];
const STATUSES = [
  { status: PostStatus.PUBLISHED },
  { status: PostStatus.PRIVATE },
  { status: PostStatus.PROTECTED, expect404: true },
  { status: PostStatus.DRAFT, expect404: true },
];

test.describe('Posts', () => {
  test.describe.configure({ mode: 'parallel' });

  test.beforeEach(async ({ baseURL, context }) => {
    await setConsentCookies(context, baseURL);
  });

  TYPES.forEach((type) => {
    const { singular, collection } = DOMAINS[type];

    test.describe(type, () => {
      STATUSES.forEach(({ status, expect404 }) => {
        test(`can view ${status} page`, async ({ page }) => {
          const post = createPost({ status, type }, 'poem');
          await prisma.post.create({ data: post });
          await page.goto(`/${collection}/${post.slug}`);

          const titleRegex = new RegExp(
            `${capitalize(singular)} #[0-9]+: ${post.title} | ${
              Settings.SITE_TITLE
            }`,
          );
          const expectedTitle = expect404 ? '404: Not Found' : titleRegex;
          await expect(page).toHaveTitle(expectedTitle);
        });

        if (status === PostStatus.PUBLISHED) {
          test(`published ${singular} has no header`, ({ page }) => {
            page.on('request', async (request) => {
              const header = await request.headerValue('X-Robots-Tag');
              expect(header).toBeNull();
            });
          });
        } else if (status === PostStatus.PRIVATE) {
          test(`published ${singular} has noindex header`, ({ page }) => {
            page.on('request', async (request) => {
              const header = await request.headerValue('X-Robots-Tag');
              expect(header).not.toBeNull();
            });
          });
        }
      });
    });
  });
});
