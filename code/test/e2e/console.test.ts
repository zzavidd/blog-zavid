import { expect, test } from '@playwright/test';
import { DiaryStatus, PostStatus, PostType } from '@prisma/client';

import Settings from 'utils/settings';

import {
  createDiaryEntry,
  createPost,
  createSubscriber,
} from '../../ops/ingestion/factory';
import prisma from '../utils/prisma';

const subscriber = createSubscriber();
const TEST_PARAMS: TestParam[] = [
  { name: 'home', createHref: () => '/' },
  { name: 'diary index', createHref: () => '/diary' },
  { name: 'diary entry', createHref: createDiaryHref },
  { name: 'musing', createHref: createMusingHref },
  { name: 'passage', createHref: createPassageHref },
  { name: 'reverie', createHref: createReverieHref },
  { name: 'about', createHref: () => '/about' },
  { name: 'subscribe', createHref: () => '/subscribe' },
  { name: 'subscriptions', createHref: createSubscrptionHref },
  { name: 'privacy', createHref: () => '/privacy' },
  { name: 'cookies', createHref: () => '/cookies' },
];

test.describe.configure({ mode: 'parallel' });
test.describe('Console', () => {
  const errors: string[] = [];

  test.beforeEach(({ page }) => {
    errors.length = 0;
    page.on('console', (message) => {
      if (message.type() === 'error') {
        errors.push(message.text());
      }
    });
  });

  TEST_PARAMS.forEach(({ name, createHref }) => {
    test(`has no errors on ${name} page`, async ({ page }) => {
      const href = await createHref();
      await page.goto(href);
      await expect(page).not.toHaveTitle(
        `404: Not Found | ${Settings.SITE_TITLE}`,
      );
      expect(errors).toHaveLength(0);
    });
  });
});

async function createDiaryHref(): Promise<string> {
  const diary = createDiaryEntry({ status: DiaryStatus.PUBLISHED });
  await prisma.diary.create({ data: diary });
  return `/diary/${diary.entryNumber}`;
}

async function createMusingHref(): Promise<string> {
  let musing = createPost({
    type: PostType.MUSING,
    status: PostStatus.PUBLISHED,
  });
  musing = await prisma.post.create({ data: musing });
  return `/musings/${musing.slug}`;
}

async function createPassageHref(): Promise<string> {
  let passage = createPost({
    type: PostType.PASSAGE,
    status: PostStatus.PRIVATE,
  });
  passage = await prisma.post.create({ data: passage });
  return `/passages/${passage.slug}`;
}

async function createReverieHref(): Promise<string> {
  let reverie = createPost({
    type: PostType.REVERIE,
    status: PostStatus.PUBLISHED,
  });
  reverie = await prisma.post.create({ data: reverie });
  return `/reveries/${reverie.slug}`;
}

async function createSubscrptionHref(): Promise<string> {
  await prisma.subscriber.create({ data: subscriber });
  return `/subscriptions?token=${subscriber.token}`;
}

interface TestParam {
  name: string;
  createHref: () => Promise<string> | string;
}
