import type { Diary, Prisma } from '@prisma/client';

import { IDiaryStatus } from 'constants/enums';
import prisma from 'server/prisma';

export default class DiaryAPI {
  public static findMany(args: Prisma.DiaryFindManyArgs): Promise<Diary[]> {
    return prisma.diary.findMany(args);
  }

  public static find(args: Prisma.DiaryFindFirstOrThrowArgs): Promise<Diary> {
    return prisma.diary.findFirstOrThrow(args);
  }

  public static update(args: Prisma.DiaryUpdateArgs): Promise<Diary> {
    return prisma.diary.update(args);
  }

  public static async delete(ids: number[]): Promise<void> {
    await prisma.diary.deleteMany({ where: { id: { in: ids } } });
  }

  public static async getTriplet(currentId: number): Promise<DiaryTriplet> {
    const [previous, current, next] = await this.findMany({
      where: { entryNumber: { in: [currentId, currentId - 1, currentId + 1] } },
    });
    return { current, previous, next };
  }

  public static getLatest(): Promise<Diary> {
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
