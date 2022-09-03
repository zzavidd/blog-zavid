import type { DiaryDAO } from 'classes';
import { DiaryQueryBuilder, DiaryStatic, DiaryStatus } from 'classes';
import { knex } from 'constants/knex';
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
    return diaryEntry;
  }

  export async function getByNumber(number: number) {
    const [[current], [previous], [next]] = await Promise.all([
      new DiaryQueryBuilder(knex).whereEntryNumber(number).build(),
      new DiaryQueryBuilder(knex).getPreviousEntry(number).build(),
      new DiaryQueryBuilder(knex).getNextEntry(number).build(),
    ]);

    return {
      current,
      previous,
      next,
    };
  }

  export async function getLatest(): Promise<DiaryDAO> {
    const [latestDiaryEntry] = await new DiaryQueryBuilder(knex)
      .whereStatus({ include: [DiaryStatus.PUBLISHED] })
      .getLatestEntry()
      .build();
    return latestDiaryEntry;
  }
}

export default DiaryAPI;
