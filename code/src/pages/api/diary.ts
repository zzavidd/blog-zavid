import type { DiaryDAO, DiaryStatusFilters, QuerySort } from 'classes';
import { DiaryStatus, DiaryQueryBuilder, DiaryStatic } from 'classes';
import { knex } from 'constants/knex';
import type { GetDiaryOptions } from 'private/api/service/diary.service';

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

export async function getDiaryEntrySSR(id: string) {
  const entryNumber = parseInt(id);
  const diaryEntries = await getDiaryEntryByNumber(entryNumber);
  return JSON.stringify(diaryEntries);
}

export async function getDiaryEntryByNumber(number: number) {
  // const isUnauthorized =
  //   DiaryStatic.isProtected(diaryEntry) && !req.isAuthenticated();

  // if (!diaryEntry || isUnauthorized) {
  //   return next(ERRORS.NO_ENTITY('diary entry'));
  // }

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

export async function getLatestDiaryEntry(): Promise<DiaryDAO> {
  const [latestDiaryEntry] = await new DiaryQueryBuilder(knex)
    .whereStatus({ include: [DiaryStatus.PUBLISHED] })
    .getLatestEntry()
    .build();
  return latestDiaryEntry;
}

export interface GetAllDiaryOptions {
  sort: QuerySort;
  status: DiaryStatusFilters;
  onlyFavourites: boolean;
}
