import { DiaryQueryBuilder } from 'classes/diary/DiaryQueryBuilder';
import { DiaryStatic } from 'classes/diary/DiaryStatic';
import { knex } from 'constants/knex';
import { IDiaryStatus } from 'constants/types';
import type { GetAllDiaryOptions } from 'pages/api/diary';

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
}

export default DiaryAPI;
