import {
  DiaryMutationBuilder,
  DiaryQueryBuilder,
} from 'classes/diary/DiaryQueryBuilder';
import { DiaryStatic } from 'classes/diary/DiaryStatic';
import { IDiaryStatus } from 'constants/enums';
import { knex } from 'constants/knex';
import Emails from 'private/emails';

namespace DiaryAPI {
  export async function getAll({
    sort,
    status,
    onlyFavourites = false,
  }: GetAllDiaryOptions): Promise<DiaryDAO[]> {
    const diaryEntries = await new DiaryQueryBuilder(knex)
      .whereStatus(status)
      .whereIsFavourite(onlyFavourites)
      .withOrder(sort)
      .build();
    return DiaryStatic.parseBatch(diaryEntries);
  }

  export async function getById(id: number) {
    const [diaryEntry] = await new DiaryQueryBuilder(knex).whereId(id).build();
    return DiaryStatic.parse(diaryEntry);
  }

  export async function getByNumber(number: number) {
    const [[current], [previous], [next]] = await Promise.all([
      new DiaryQueryBuilder(knex).whereEntryNumber(number).build(),
      new DiaryQueryBuilder(knex).getPreviousEntry(number).build(),
      new DiaryQueryBuilder(knex).getNextEntry(number).build(),
    ]);

    return {
      current: DiaryStatic.parse(current),
      previous,
      next,
    };
  }

  export async function getLatest(): Promise<DiaryDAO> {
    const [latestDiaryEntry] = await new DiaryQueryBuilder(knex)
      .whereStatus({ include: [IDiaryStatus.PUBLISHED] })
      .getLatestEntry()
      .build();
    return DiaryStatic.parse(latestDiaryEntry);
  }

  /**
   * Inserts a new diary entry into the database.
   * @param payload The payload for creating a diary entry.
   */
  export async function create({
    diaryEntry,
    isPublish,
  }: CreateDiaryEntryPayload): Promise<void> {
    diaryEntry.slug = DiaryStatic.generateSlug(diaryEntry);
    diaryEntry.tags = JSON.stringify(diaryEntry.tags);

    await new DiaryMutationBuilder(knex).insert(diaryEntry).build();
    if (isPublish) {
      await Emails.notifyNewDiaryEntry(diaryEntry);
    }
  }

  export async function update({
    id,
    diaryEntry,
    isPublish,
  }: UpdateDiaryEntryPayload) {
    diaryEntry.slug = DiaryStatic.generateSlug(diaryEntry);
    diaryEntry.tags = JSON.stringify(diaryEntry.tags);

    await new DiaryMutationBuilder(knex).update(diaryEntry).whereId(id).build();
    if (isPublish) {
      await Emails.notifyNewDiaryEntry(diaryEntry);
    }
  }

  export async function destroy({ id }: DeleteDiaryEntryPayload) {
    await new DiaryMutationBuilder(knex).delete(id).build();
  }
}

export default DiaryAPI;
