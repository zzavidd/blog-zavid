import { faker } from '@faker-js/faker/locale/en_GB';
import type { Prisma } from '@prisma/client';
import { DiaryStatus, PostStatus, PostType } from '@prisma/client';

import prisma from 'server/prisma';

import {
  createDiaryEntry,
  createExclusive,
  createPost,
  createSubscriber,
} from './factory';
import { createDefaultPages } from './functions';

await ingestDiaryEntries();
await ingestExclusives();
await ingestPages();
await ingestPosts();
await ingestSubscribers();

async function ingestDiaryEntries(): Promise<void> {
  const categories: Prisma.DiaryCategoryUncheckedCreateInput[] = [];

  for (let i = 1; i <= 5; i++) {
    categories.push({ id: i, name: faker.lorem.word() });
  }

  await prisma.diaryCategory.deleteMany({});
  await prisma.diary.deleteMany({});
  await prisma.diaryCategory.createMany({ data: categories });

  const queries = Array(50)
    .fill(null)
    .map((_, i) => {
      const categoryIds = faker.helpers
        .arrayElements(categories)
        .map((c) => ({ id: c.id }));
      const entry = createDiaryEntry({
        entryNumber: i + 1,
        status: DiaryStatus.PUBLISHED,
        categories: {
          connect: categoryIds,
        },
      });
      return prisma.diary.create({ data: entry });
    });
  await prisma.$transaction(queries);
}

async function ingestExclusives(): Promise<void> {
  const exclusives: Prisma.ExclusiveCreateInput[] = [];

  for (let i = 1; i <= 5; i++) {
    exclusives.push(createExclusive());
  }

  await prisma.exclusive.deleteMany({});
  await prisma.exclusive.createMany({ data: exclusives });
}

async function ingestPages(): Promise<void> {
  const pages = createDefaultPages();
  await prisma.page.deleteMany({});
  await prisma.page.createMany({ data: pages });
}

async function ingestPosts(): Promise<void> {
  const posts: Prisma.PostCreateInput[] = [];

  for (let i = 1; i <= 10; i++) {
    posts.push(
      createPost({
        status: PostStatus.PUBLISHED,
        type: PostType.REVERIE,
        typeId: i,
      }),
    );
    posts.push(
      createPost(
        { status: PostStatus.PUBLISHED, type: PostType.MUSING, typeId: i },
        'poem',
      ),
    );
  }

  for (let i = 1; i <= 5; i++) {
    posts.push(
      createPost({ status: PostStatus.PRIVATE, type: PostType.PASSAGE }),
    );
  }

  await prisma.post.deleteMany({});
  await prisma.post.createMany({ data: posts });
}

async function ingestSubscribers(): Promise<void> {
  const subscribers: Prisma.SubscriberCreateInput[] = [];

  for (let i = 1; i <= 50; i++) {
    subscribers.push(createSubscriber());
  }

  await prisma.subscriber.deleteMany({});
  await prisma.subscriber.createMany({ data: subscribers });
}
