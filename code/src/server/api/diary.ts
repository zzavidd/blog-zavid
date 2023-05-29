import type { Diary, Prisma } from '@prisma/client';

import prisma from 'server/prisma';

export default class DiaryAPI {
  public static findMany(args: Prisma.DiaryFindManyArgs): Promise<Diary[]> {
    return prisma.diary.findMany(args);
  }

  public static find(
    args: Prisma.DiaryFindFirstOrThrowArgs,
  ): Promise<Diary | null> {
    return prisma.diary.findFirst(args);
  }

  public static create(args: Prisma.DiaryCreateArgs): Promise<Diary> {
    return prisma.diary.create(args);
  }

  public static update(args: Prisma.DiaryUpdateArgs): Promise<Diary> {
    return prisma.diary.update(args);
  }

  public static async delete(ids: number[]): Promise<void> {
    await prisma.diary.deleteMany({ where: { id: { in: ids } } });
  }
}
