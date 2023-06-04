import type { ConsoleMessage } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { DiaryStatus } from '@prisma/client';

import {
  createDiaryEntry,
  createSubscriber,
} from '../../ops/ingestion/factory';
import prisma from '../../src/server/prisma';

const entryNumber = 1;
const diary = createDiaryEntry({ entryNumber, status: DiaryStatus.PUBLISHED });
const subscriber = createSubscriber();

test.describe('Console', () => {
  const errors: ConsoleMessage[] = [];

  test.beforeAll(async () => {
    await prisma.diary.upsert({
      create: diary,
      update: diary,
      where: { entryNumber },
    });
    await prisma.subscriber.upsert({
      create: subscriber,
      update: subscriber,
      where: { id: 1 },
    });
  });

  test.beforeEach(({ page }) => {
    page.on('console', (message) => {
      if (message.type() === 'error') {
        errors.push(message);
      }
    });
  });

  [
    { name: 'home', href: '/' },
    { name: 'diary index', href: '/diary' },
    { name: 'diary entry', href: '/diary/1' },
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
