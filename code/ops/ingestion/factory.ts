import { faker } from '@faker-js/faker/locale/en_GB';
import type { Prisma } from '@prisma/client';
import { DiaryStatus } from '@prisma/client';

import ZString from '../../src/utils/lib/string';

export function createDiaryEntry(
  overrides: Partial<Prisma.DiaryCreateInput> = {},
): Prisma.DiaryCreateInput {
  const { entryNumber = 1, status } = overrides;
  return {
    title: ZString.toTitleCase(faker.lorem.words({ min: 1, max: 5 })),
    date: faker.date.past(),
    entryNumber,
    status: status ?? faker.helpers.enumValue(DiaryStatus),
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

export function createSubscriber(
  overrides: Partial<Prisma.SubscriberCreateInput> = {},
): Prisma.SubscriberCreateInput {
  const name = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  };
  return {
    email: faker.internet.email(name),
    firstname: name.firstName,
    lastname: name.lastName,
    subscriptions: {
      Diary: faker.datatype.boolean(),
      Reverie: faker.datatype.boolean(),
    },
    token: faker.string.uuid(),
    ...overrides,
  };
}
