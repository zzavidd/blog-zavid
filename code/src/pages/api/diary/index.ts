import type { DiaryDAO, DiaryStatusFilters, QuerySort } from 'classes';
import { DiaryQueryBuilder, DiaryStatic } from 'classes';
import type { GetDiaryOptions } from 'src/private/api/service/diary.service';
import { knex } from 'src/private/db';

export async function getAllDiaryEntriesSSR(
  options: GetDiaryOptions,
): Promise<string> {
  const diaryEntries = await getAllDiaryEntries(options);
  return JSON.stringify(diaryEntries);
}

export async function getAllDiaryEntries({
  sort,
  status,
  onlyFavourites,
}: GetDiaryOptions): Promise<DiaryDAO[]> {
  const diaryEntries = await new DiaryQueryBuilder(knex)
    .whereStatus(status)
    .whereIsFavourite(onlyFavourites)
    .withOrder(sort)
    .build();
  return DiaryStatic.parseBatch(diaryEntries);
}

export interface GetAllDiaryOptions {
  sort: QuerySort;
  status: DiaryStatusFilters;
  onlyFavourites: boolean;
}
