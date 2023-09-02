import { expect, test as setup } from '@playwright/test';
import 'dotenv/config';

import logger from 'utils/logger';

import { createDefaultPages } from '../../ops/ingestion/functions';

import prisma from './prisma';

setup('Setup', async () => {
  verifyDatabaseIsTest();
  await clearDatabase();

  // For console tests.
  const pages = createDefaultPages();
  await prisma.page.createMany({ data: pages, skipDuplicates: true });
});

function verifyDatabaseIsTest(): void {
  const url = process.env.DATABASE_TEST_URL;

  expect(url).toBeDefined();
  expect(url!.endsWith('_test'), {
    message: 'Failsafe triggered: erroneously using non-development database.',
  }).toBe(true);
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
