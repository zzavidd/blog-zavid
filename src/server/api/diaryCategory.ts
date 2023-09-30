/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { DiaryCategory, Prisma } from '@prisma/client';

import prisma from 'server/prisma';

export default class DiaryCategoryAPI {
  public static findMany() {
    return prisma.diaryCategory.findMany({
      include: { _count: true },
    });
  }

  public static create(
    args: Prisma.DiaryCategoryCreateArgs,
  ): Promise<DiaryCategory> {
    return prisma.diaryCategory.create(args);
  }

  public static update(
    args: Prisma.DiaryCategoryUpdateArgs,
  ): Promise<DiaryCategory> {
    return prisma.diaryCategory.update(args);
  }

  public static async delete(
    args: Prisma.DiaryCategoryDeleteArgs,
  ): Promise<void> {
    await prisma.diaryCategory.delete(args);
  }
}
