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

  console.log(await prisma.page.findMany());

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
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;
  await prisma.$executeRaw`TRUNCATE diary_categories;`;
  await prisma.$executeRaw`TRUNCATE diary;`;
  await prisma.$executeRaw`TRUNCATE pages;`;
  await prisma.$executeRaw`TRUNCATE posts;`;
  await prisma.$executeRaw`TRUNCATE subscribers;`;
  await prisma.$executeRaw`TRUNCATE wishlist_categories;`;
  await prisma.$executeRaw`TRUNCATE wishlist;`;
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
  logger.info('Database cleared.');
}
