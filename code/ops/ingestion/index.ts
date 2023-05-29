import { faker } from '@faker-js/faker/locale/en_GB';
import type { Prisma } from '@prisma/client';
import { DiaryStatus, PrismaClient } from '@prisma/client';

import ZString from '../../src/lib/string';

const prisma = new PrismaClient();

(async () => {
  await ingestDiaryEntries();
  await ingestPages();
  await ingestSubscribers();
})();

async function ingestDiaryEntries(): Promise<void> {
  const diary: Prisma.DiaryCreateInput[] = [];

  for (let i = 1; i <= 50; i++) {
    diary.push({
      title: ZString.toTitleCase(faker.lorem.words({ min: 1, max: 5 })),
      date: faker.date.past(),
      entryNumber: i,
      status: faker.helpers.enumValue(DiaryStatus),
      content: faker.lorem.paragraphs({ min: 5, max: 10 }, '\n\n'),
      footnote: faker.datatype.boolean()
        ? faker.lorem.paragraphs({ min: 1, max: 4 }, '\n\n')
        : '',
      isFavourite: faker.datatype.boolean(),
      tags: Array(faker.number.int({ max: 12 }))
        .fill(null)
        .map(() => faker.lorem.word()),
    });
  }

  await prisma.diary.deleteMany({});
  await prisma.diary.createMany({ data: diary });
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

async function ingestSubscribers(): Promise<void> {
  const subscribers: Prisma.SubscriberCreateInput[] = [];

  for (let i = 1; i <= 50; i++) {
    const name = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    };
    subscribers.push({
      email: faker.internet.email(name),
      firstname: name.firstName,
      lastname: name.lastName,
      subscriptions: {
        Diary: faker.datatype.boolean(),
        Reverie: faker.datatype.boolean(),
      },
      token: faker.string.uuid(),
    });
  }

  await prisma.subscriber.deleteMany({});
  await prisma.subscriber.createMany({ data: subscribers });
}
