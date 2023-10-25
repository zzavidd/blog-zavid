import { type PrismaClient } from '@prisma/client';

export async function clearDatabase(prisma: PrismaClient): Promise<void> {
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;
  await prisma.$executeRaw`TRUNCATE diary_categories;`;
  await prisma.$executeRaw`TRUNCATE diary;`;
  await prisma.$executeRaw`TRUNCATE pages;`;
  await prisma.$executeRaw`TRUNCATE posts;`;
  await prisma.$executeRaw`TRUNCATE subscribers;`;
  await prisma.$executeRaw`TRUNCATE wishlist_categories;`;
  await prisma.$executeRaw`TRUNCATE wishlist;`;
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
}
