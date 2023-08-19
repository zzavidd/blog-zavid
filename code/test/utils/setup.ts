import 'dotenv/config';

import logger from 'utils/logger';

import { createDefaultPages } from '../../ops/ingestion/functions';

import prisma from './prisma';

export default async function globalSetup(): Promise<void> {
  verifyDatabaseIsTest();
  await clearDatabase();
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

  const pages = createDefaultPages();
  await prisma.page.createMany({ data: pages });
}