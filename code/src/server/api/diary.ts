import type { Diary, Prisma } from '@prisma/client';
import invariant from 'tiny-invariant';
import { z } from 'zod';

import Emailer from 'server/emails';
import prisma from 'server/prisma';
import { truncateText } from 'utils/lib/text';

export default class DiaryAPI {
  public static async findMany(
    params: Prisma.DiaryFindManyArgs,
    options: DiaryFindManyOptions = {},
  ): Promise<Diary[]> {
    const { contentWordLimit } = options;
    let diary = await prisma.diary.findMany(params);
    if (contentWordLimit) {
      diary = diary.map((entry) => {
        entry.content = truncateText(entry.content, {
          limit: contentWordLimit,
        });
        return entry;
      });
    }
    return diary;
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

  public static async publish(id: number): Promise<string> {
    const diary = await this.find({ where: { id } });
    invariant(diary, 'No diary entry with ID found.');
    return Emailer.notifyNewDiaryEntry(diary, { isTest: true });
  }
}

export const zDiaryFindManyOptions = z
  .object({ contentWordLimit: z.number().optional() })
  .optional();

type DiaryFindManyOptions = z.infer<typeof zDiaryFindManyOptions>;
