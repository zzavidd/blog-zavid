import { faker } from '@faker-js/faker/locale/en_GB';
import { expect, test } from '@playwright/test';
import { DiaryStatus, PostStatus, PostType } from '@prisma/client';

import {
  createDiaryEntry,
  createPost,
  createSubscriber,
} from '../../ops/ingestion/factory';
import prisma from '../../src/server/prisma';

const entryNumber = 1;
const slug = faker.lorem.slug();

const diary = createDiaryEntry({ entryNumber, status: DiaryStatus.PUBLISHED });
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
      create: passage,
      update: passage,
      where: { id: 1 },
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
    { name: 'passage', href: `/passages/${slug}` },
    { name: 'about', href: '/about' },
    { name: 'subscribe', href: '/subscribe' },
    { name: 'subscriptions', href: `/subscriptions?token=${subscriber.token}` },
    { name: 'privacy', href: '/privacy' },
    { name: 'cookies', href: '/cookies' },
  ].forEach(({ name, href }) => {
    test(`has no errors on ${name} page`, async ({ page }) => {
      await page.goto(href);
      expect(errors).toHaveLength(0);
    });
  });
});
