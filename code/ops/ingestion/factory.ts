import { faker } from '@faker-js/faker/locale/en_GB';
import type { Prisma } from '@prisma/client';
import { DiaryStatus, PostStatus, PostType } from '@prisma/client';

import { SubscriptionType } from 'utils/enum';
import ZString from 'utils/lib/string';

export function createDiaryEntry(
  overrides: Partial<Prisma.DiaryCreateInput> = {},
): Prisma.DiaryCreateInput {
  const { entryNumber = 1, status } = overrides;
  return {
    title: ZString.toTitleCase(faker.lorem.words({ min: 1, max: 5 })),
    date: faker.date.past(),
    entryNumber,
    status: status ?? faker.helpers.enumValue(DiaryStatus),
    categories: overrides.categories,
    content: faker.lorem.paragraphs({ min: 5, max: 10 }, '\n\n'),
    footnote: faker.datatype.boolean()
      ? faker.lorem.paragraphs({ min: 1, max: 4 }, '\n\n')
      : '',
    isFavourite: faker.datatype.boolean(),
    tags: Array(faker.number.int({ max: 12 }))
      .fill(null)
      .map(() => faker.lorem.word()),
    ...overrides,
  };
}

export function createPost(
  overrides: Partial<Prisma.PostCreateInput> = {},
  contentType: 'poem' | 'prose' = 'prose',
): Prisma.PostCreateInput {
  const {
    status = faker.helpers.enumValue(PostStatus),
    type = faker.helpers.enumValue(PostType),
    slug,
  } = overrides;
  const title = ZString.toTitleCase(faker.lorem.words({ min: 1, max: 5 }));
  const content =
    contentType === 'prose'
      ? faker.lorem.paragraphs({ min: 5, max: 10 }, '\n\n')
      : Array(faker.number.int({ max: 12 }))
          .fill(null)
          .map(() => faker.lorem.lines({ min: 4, max: 8 }))
          .join('\n\n');

  return {
    title,
    type,
    datePublished: faker.date.past(),
    status:
      status === PostStatus.PUBLISHED && type === PostType.PASSAGE
        ? PostStatus.PRIVATE
        : status,
    content,
    excerpt: faker.lorem.sentence(),
    slug: slug ?? ZString.createSlug(title),
    ...overrides,
  };
}

export function createSubscriber(
  overrides: Partial<Prisma.SubscriberCreateInput> = {},
): Prisma.SubscriberCreateInput {
  const name = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  };
  const subscriptions = {} as SubscriptionMap;
  Object.values(SubscriptionType).forEach((type) => {
    subscriptions[type] = faker.datatype.boolean();
  });
  return {
    email: faker.internet.email(name),
    firstname: name.firstName,
    lastname: name.lastName,
    subscriptions,
    token: faker.string.uuid(),
    ...overrides,
  };
}
