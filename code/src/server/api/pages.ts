import type { Page, Prisma } from '@prisma/client';

import prisma from 'server/prisma';

namespace PageAPI {
  export function findMany(params: Prisma.PageWhereInput): Promise<Page[]> {
    return prisma.page.findMany({ where: params });
  }

  export function find(params: Prisma.PageWhereInput): Promise<Page> {
    return prisma.page.findFirstOrThrow({ where: params });
  }
}

export default PageAPI;
