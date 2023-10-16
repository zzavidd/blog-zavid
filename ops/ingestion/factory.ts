import { faker } from '@faker-js/faker/locale/en_GB';
import type { Prisma } from '@prisma/client';
import {
  DiaryStatus,
  ExclusiveStatus,
  MoodTimeOfDay,
  PostStatus,
  PostType,
} from '@prisma/client';

import { SubscriptionType } from 'utils/enum';
import ZString from 'utils/lib/string';

export function createDiaryEntry(
  overrides: Partial<Prisma.DiaryCreateInput> = {},
): Prisma.DiaryCreateInput {
  const { entryNumber, status } = overrides;
  return {
    title: ZString.toTitleCase(faker.lorem.words({ min: 1, max: 5 })),
    date: faker.date.past(),
    entryNumber: entryNumber ?? faker.number.int({ max: 2 ** 11 }),
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

export function createExclusive(
  overrides: Partial<Prisma.ExclusiveCreateInput> = {},
): Prisma.ExclusiveCreateInput {
  const { status, slug } = overrides;
  const subject = ZString.toTitleCase(faker.lorem.words({ min: 1, max: 5 }));
  return {
    subject,
    preview: faker.lorem.sentences(2),
    content: faker.lorem.paragraphs({ min: 5, max: 10 }, '\n\n'),
    date: faker.date.past(),
    endearment: '',
    status: status ?? faker.helpers.enumValue(ExclusiveStatus),
    slug: slug ?? ZString.createSlug(subject),
  };
}

export function createMood(
  overrides: Partial<Prisma.MoodCreateInput> = {},
): Prisma.MoodCreateInput {
  return {
    date: overrides.date || faker.date.past(),
    timeOfDay: overrides.timeOfDay || faker.helpers.enumValue(MoodTimeOfDay),
    value: faker.number.int({ min: 0, max: 10 }),
    reason: faker.datatype.boolean() ? faker.lorem.sentence() : '',
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
    image: faker.image.urlLoremFlickr({ width: 1280, height: 720 }),
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
