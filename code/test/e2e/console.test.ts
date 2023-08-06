import { faker } from '@faker-js/faker/locale/en_GB';
import { expect, test } from '@playwright/test';
import { DiaryStatus, PostStatus, PostType } from '@prisma/client';

import Settings from 'utils/settings';

import {
  createDiaryEntry,
  createPost,
  createSubscriber,
} from '../../ops/ingestion/factory';
import prisma from '../utils/prisma';

const entryNumber = 1;
const slug = faker.lorem.slug();

const diary = createDiaryEntry({ entryNumber, status: DiaryStatus.PUBLISHED });
const musing = createPost({
  type: PostType.MUSING,
  status: PostStatus.PUBLISHED,
  slug,
});
const reverie = createPost({
  type: PostType.REVERIE,
  status: PostStatus.PUBLISHED,
  slug,
});
const passage = createPost({
  type: PostType.PASSAGE,
  status: PostStatus.PRIVATE,
  slug,
});

const subscriber = createSubscriber();

test.describe.configure({ mode: 'parallel' });
test.describe('Console', () => {
  const errors: string[] = [];

  test.beforeAll(async () => {
    await prisma.diary.upsert({
      create: diary,
      update: diary,
      where: { entryNumber },
    });
    await prisma.post.upsert({
      create: musing,
      update: musing,
      where: { id: 1 },
    });
    await prisma.post.upsert({
      create: passage,
      update: passage,
      where: { id: 2 },
    });
    await prisma.post.upsert({
      create: reverie,
      update: reverie,
      where: { id: 3 },
    });
    await prisma.subscriber.upsert({
      create: subscriber,
      update: subscriber,
      where: { email: subscriber.email },
    });
  });

  test.beforeEach(({ page }) => {
    page.on('console', (message) => {
      if (message.type() === 'error') {
        errors.push(message.text());
      }
    });
  });

  [
    { name: 'home', href: '/' },
    { name: 'diary index', href: '/diary' },
    { name: 'diary entry', href: `/diary/${entryNumber}` },
    { name: 'musing', href: `/musings/${slug}` },
    { name: 'passage', href: `/passages/${slug}` },
    { name: 'reverie', href: `/reveries/${slug}` },
    { name: 'about', href: '/about' },
    { name: 'subscribe', href: '/subscribe' },
    { name: 'subscriptions', href: `/subscriptions?token=${subscriber.token}` },
    { name: 'privacy', href: '/privacy' },
    { name: 'cookies', href: '/cookies' },
  ].forEach(({ name, href }) => {
    test(`has no errors on ${name} page`, async ({ page }) => {
      await page.goto(href);
      await expect(page).not.toHaveTitle(
        `404: Not Found | ${Settings.SITE_TITLE}`,
      );
      expect(errors).toHaveLength(0);
    });
  });
});
