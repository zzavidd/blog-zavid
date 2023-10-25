import { expect, test as setup } from '@playwright/test';

import { clearDatabase } from 'utils/functions/database';

import { createDefaultPages } from '../../ops/ingestion/functions';

import prisma from './prisma';

setup('Setup', async () => {
  verifyDatabaseIsTest();
  await clearDatabase(prisma);

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
