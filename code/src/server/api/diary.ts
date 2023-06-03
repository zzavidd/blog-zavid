import type { Diary, Prisma } from '@prisma/client';

import Emailer from 'server/emails';
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

  public static async create(
    args: Prisma.DiaryCreateArgs,
    isPublish = false,
  ): Promise<Diary> {
    const diary = await prisma.diary.create(args);
    if (isPublish) {
      void Emailer.notifyNewDiaryEntry(diary);
    }
    return diary;
  }

  public static async update(
    args: Prisma.DiaryUpdateArgs,
    isPublish = false,
  ): Promise<Diary> {
    const diary = await prisma.diary.update(args);
    if (isPublish) {
      void Emailer.notifyNewDiaryEntry(diary);
    }
    return diary;
  }

  public static async delete(ids: number[]): Promise<void> {
    await prisma.diary.deleteMany({ where: { id: { in: ids } } });
  }
}
