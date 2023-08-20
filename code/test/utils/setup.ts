import { DiaryStatus } from '@prisma/client';
import 'dotenv/config';

import logger from 'utils/logger';

import { createDiaryEntry } from '../../ops/ingestion/factory';
import { createDefaultPages } from '../../ops/ingestion/functions';

import { DIARY_ENTRY_NUMBERS } from './constants';
import prisma from './prisma';

export default async function globalSetup(): Promise<void> {
  verifyDatabaseIsTest();
  await clearDatabase();

  // For console tests.
  const pages = createDefaultPages();
  await prisma.page.createMany({ data: pages });

  // For curator tests.
  const diary = createDiaryEntry({
    entryNumber: DIARY_ENTRY_NUMBERS.CURATOR,
    status: DiaryStatus.PUBLISHED,
  });
  await prisma.diary.create({ data: diary });
}

function verifyDatabaseIsTest(): void {
  const url = process.env.DATABASE_TEST_URL;
  if (!url || !url.endsWith('_test')) {
    logger.warn(
      'Failsafe triggered: erroneously using non-development database.',
    );
    process.exit(0);
  }
}

async function clearDatabase(): Promise<void> {
  logger.info('Clearing database...');
  await prisma.diaryCategory.deleteMany({});
  await prisma.diary.deleteMany({});
  await prisma.page.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.subscriber.deleteMany({});
  await prisma.wishlistCategory.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  logger.info('Database cleared.');
}
