import type { Page, Prisma } from '@prisma/client';

import prisma from 'server/prisma';

export default class PageAPI {
  public static findMany(params: Prisma.PageFindManyArgs): Promise<Page[]> {
    return prisma.page.findMany(params);
  }

  public static find(params: Prisma.PageFindFirstArgs): Promise<Page | null> {
    return prisma.page.findFirst(params);
  }
}
