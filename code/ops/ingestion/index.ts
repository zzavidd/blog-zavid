import { faker } from '@faker-js/faker/locale/en_GB';
import type { Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

import { createDiaryEntry, createSubscriber } from './factory';

const prisma = new PrismaClient();

(async () => {
  await ingestDiaryEntries();
  await ingestSubscribers();
  await ingestPages();
})();

async function ingestDiaryEntries(): Promise<void> {
  const categories: Prisma.DiaryCategoryUncheckedCreateInput[] = [];

  for (let i = 1; i <= 7; i++) {
    categories.push({ id: i, name: faker.lorem.word() });
  }

  await prisma.diaryCategory.deleteMany({});
  await prisma.diary.deleteMany({});
  await prisma.diaryCategory.createMany({ data: categories });

  const promises = Array(50)
    .fill(null)
    .map((_, i) => {
      const categoryIds = faker.helpers
        .arrayElements(categories)
        .map((c) => ({ id: c.id }));
      const entry = createDiaryEntry({
        entryNumber: i + 1,
        categories: {
          connect: categoryIds,
        },
      });
      return prisma.diary.create({ data: entry });
    });

  await Promise.all(promises);
}

async function ingestSubscribers(): Promise<void> {
  const subscribers: Prisma.SubscriberCreateInput[] = [];

  for (let i = 1; i <= 50; i++) {
    subscribers.push(createSubscriber());
  }

  await prisma.subscriber.deleteMany({});
  await prisma.subscriber.createMany({ data: subscribers });
}

async function ingestPages(): Promise<void> {
  const pages: Prisma.PageCreateInput[] = [
    {
      title: 'Home',
      content: faker.lorem.paragraphs(5, '\n\n'),
      excerpt: faker.lorem.sentence(),
      slug: 'home',
      isEmbed: true,
      lastModified: new Date(),
    },
    {
      title: 'Diary',
      content: faker.lorem.paragraph(),
      excerpt: faker.lorem.sentence(),
      slug: 'diary',
      isEmbed: true,
      lastModified: new Date(),
    },
    {
      title: 'About Zavid',
      content: faker.lorem.paragraphs(15, '\n\n'),
      excerpt: faker.lorem.sentence(),
      slug: 'about',
      isEmbed: false,
      lastModified: new Date(),
    },
    {
      title: 'Privacy Policy',
      content: faker.lorem.paragraphs(8, '\n\n'),
      excerpt: faker.lorem.sentence(),
      slug: 'privacy',
      isEmbed: false,
      lastModified: new Date(),
    },
    {
      title: 'Cookie Policy',
      content: faker.lorem.paragraphs(8, '\n\n'),
      excerpt: faker.lorem.sentence(),
      slug: 'cookies',
      isEmbed: false,
      lastModified: new Date(),
    },
  ];

  await prisma.page.deleteMany({});
  await prisma.page.createMany({ data: pages });
}
