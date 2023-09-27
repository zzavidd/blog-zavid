import { faker } from '@faker-js/faker/locale/en_GB';
import type { Prisma } from '@prisma/client';

export function createDefaultPages(): Prisma.PageCreateInput[] {
  return [
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
}
