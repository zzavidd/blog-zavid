import type { Page, Prisma } from '@prisma/client';

import prisma from 'server/prisma';

export default class PageAPI {
  public static findMany(params: Prisma.PageWhereInput): Promise<Page[]> {
    return prisma.page.findMany({ where: params });
  }

  public static find(params: Prisma.PageWhereInput): Promise<Page> {
    return prisma.page.findFirstOrThrow({ where: params });
  }
}
