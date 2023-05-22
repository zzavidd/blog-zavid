import type { Diary, Prisma } from '@prisma/client';

import { IDiaryStatus } from 'constants/enums';
import prisma from 'server/prisma';

export default class DiaryAPI {
  public static findMany(args: Prisma.DiaryFindManyArgs): Promise<Diary[]> {
    return prisma.diary.findMany(args);
  }

  public static find(args: Prisma.DiaryFindFirstOrThrowArgs) {
    return prisma.diary.findFirstOrThrow(args);
  }

  public static getLatest(): Promise<Diary | null> {
    return this.find({
      orderBy: { entryNumber: 'desc' },
      where: { status: IDiaryStatus.PUBLISHED },
    });
  }

  /**
   * Inserts a new diary entry into the database.
   * @param payload The payload for creating a diary entry.
   */
  // export async function create({
  //   diaryEntry,
  //   isPublish,
  // }: CreateDiaryEntryPayload): Promise<void> {
  //   diaryEntry.slug = DiaryStatic.generateSlug(diaryEntry);
  //   diaryEntry.tags = JSON.stringify(diaryEntry.tags);

  //   await new DiaryMutationBuilder(knex).insert(diaryEntry).build();
  //   if (isPublish) {
  //     await Emails.notifyNewDiaryEntry(diaryEntry);
  //   }
  // }

  // export async function update({
  //   id,
  //   diaryEntry,
  //   isPublish,
  // }: UpdateDiaryEntryPayload) {
  //   diaryEntry.slug = DiaryStatic.generateSlug(diaryEntry);
  //   diaryEntry.tags = JSON.stringify(diaryEntry.tags);

  //   await new DiaryMutationBuilder(knex).update(diaryEntry).whereId(id).build();
  //   if (isPublish) {
  //     await Emails.notifyNewDiaryEntry(diaryEntry);
  //   }
  // }

  // export async function destroy({ id }: DeleteDiaryEntryPayload) {
  //   await new DiaryMutationBuilder(knex).delete(id).build();
  // }
}
