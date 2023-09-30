import type { Page, Prisma } from '@prisma/client';
import immutate from 'immutability-helper';

import prisma from 'server/prisma';

export default class PageAPI {
  public static findMany(params: Prisma.PageFindManyArgs): Promise<Page[]> {
    return prisma.page.findMany(params);
  }

  public static find(params: Prisma.PageFindFirstArgs): Promise<Page | null> {
    return prisma.page.findFirst(params);
  }

  public static update(args: Prisma.PageUpdateArgs): Promise<Page> {
    return prisma.page.update(
      immutate(args, {
        data: {
          lastModified: { $set: new Date() },
        },
      }),
    );
  }

  public static async delete(args: Prisma.PageDeleteArgs): Promise<void> {
    await prisma.page.delete(args);
  }
}
