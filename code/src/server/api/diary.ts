import type { Diary, DiaryCategory, Prisma } from '@prisma/client';
import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import invariant from 'tiny-invariant';
import { z } from 'zod';

import type { EmailPreviewType } from 'server/emails';
import Emailer from 'server/emails';
import prisma from 'server/prisma';
import { truncateText } from 'utils/lib/text';

export default class DiaryAPI {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public static async findMany(
    args: Prisma.DiaryFindManyArgs,
    options: DiaryFindOptions = {},
  ) {
    const { contentWordLimit } = options;
    let diary = await prisma.diary.findMany(args);
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

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public static async find(
    args: Prisma.DiaryFindFirstArgs,
    options: DiaryFindOptions = {},
  ) {
    const { contentWordLimit } = options;
    const entry = await prisma.diary.findFirst({
      ...args,
      include: { categories: true },
    });
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

  public static categories(): Promise<DiaryCategory[]> {
    return prisma.diaryCategory.findMany();
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
    return (
      nodemailer.getTestMessageUrl(
        info as unknown as SMTPTransport.SentMessageInfo,
      ) || ''
    );
  }
}

export const zDiaryFindOptions = z
  .object({ contentWordLimit: z.number().optional() })
  .optional();

type DiaryFindOptions = z.infer<typeof zDiaryFindOptions>;
