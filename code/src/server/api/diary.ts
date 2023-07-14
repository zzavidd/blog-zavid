import type { Diary, Prisma } from '@prisma/client';
import nodemailer from 'nodemailer';
import invariant from 'tiny-invariant';

import type { EmailPreviewType } from 'server/emails';
import Emailer from 'server/emails';
import prisma from 'server/prisma';
import { truncateText } from 'utils/lib/text';

export default class DiaryAPI {
  public static async findMany(
    args: Prisma.DiaryFindManyArgs,
    options: FindOptions = {},
  ): Promise<DiaryWithCategories[]> {
    const { contentWordLimit } = options;
    let diary = (await prisma.diary.findMany(args)) as DiaryWithCategories[];
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

  public static async find(
    args: Prisma.DiaryFindFirstArgs,
    options: FindOptions = {},
  ): Promise<DiaryWithCategories | null> {
    const { contentWordLimit } = options;
    const entry = (await prisma.diary.findFirst(
      args,
    )) as DiaryWithCategories | null;
    if (entry && contentWordLimit) {
      entry.content = truncateText(entry.content, {
        limit: contentWordLimit,
      });
    }
    return entry;
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

  public static async publish(
    id: number,
    previewType: EmailPreviewType,
  ): Promise<string> {
    const diary = await this.find({ where: { id } });
    invariant(diary, 'No diary entry with ID found.');
    const [info] = await Emailer.notifyNewDiaryEntry(diary, {
      isPreview: true,
      previewType,
    });
    return nodemailer.getTestMessageUrl(info) || '';
  }
}
