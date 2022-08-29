import type { NextApiRequest, NextApiResponse } from 'next';

import type { DiaryDAO, DiaryStatusFilters, QuerySort } from 'classes';
import {
  DiaryMutationBuilder,
  DiaryQueryBuilder,
  DiaryStatic,
  DiaryStatus,
} from 'classes';
import { knex } from 'constants/knex';
import { EMAILS_ON } from 'constants/settings';
import * as Emails from 'private/emails';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
): Promise<void> {
  switch (req.method) {
    case 'POST': {
      await createDiaryEntry(req.body);
      return res.send(201);
    }
    case 'PUT': {
      await updateDiaryEntry(req.body);
      return res.send(200);
    }
    case 'DELETE': {
      await deleteDiaryEntry(req.body.id);
      return res.send(204);
    }
    default: {
      res.send(405);
    }
  }
}

export async function getAllDiaryEntriesSSR(
  options: GetAllDiaryOptions,
): Promise<string> {
  const diaryEntries = await getAllDiaryEntries(options);
  return JSON.stringify(diaryEntries);
}

export async function getAllDiaryEntries({
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

export async function getDiaryEntryByNumberSSR(number: number) {
  const diaryEntries = await getDiaryEntryByNumber(number);
  return JSON.stringify(diaryEntries);
}

export async function getDiaryEntryByIdSSR(id: number) {
  const [diaryEntry] = await new DiaryQueryBuilder(knex).whereId(id).build();
  return JSON.stringify(diaryEntry);
}

export async function getDiaryEntryByNumber(number: number) {
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

export async function getLatestDiaryEntrySSR() {
  return JSON.stringify(await getLatestDiaryEntry());
}

export async function getLatestDiaryEntry(): Promise<DiaryDAO> {
  const [latestDiaryEntry] = await new DiaryQueryBuilder(knex)
    .whereStatus({ include: [DiaryStatus.PUBLISHED] })
    .getLatestEntry()
    .build();
  return latestDiaryEntry;
}

/**
 * Inserts a new diary entry into the database.
 * @param option.diaryEntry - The diary entry object to be inserted.
 * @param option.isPublish - Indicates if a publish operation.
 */
async function createDiaryEntry({
  diaryEntry,
  isPublish,
}: CreateDiaryEntryPayload): Promise<void> {
  diaryEntry.slug = DiaryStatic.generateSlug(diaryEntry);
  diaryEntry.tags = JSON.stringify(diaryEntry.tags);

  await new DiaryMutationBuilder(knex).insert(diaryEntry).build();
  if (isPublish && EMAILS_ON) {
    await Emails.notifyNewDiaryEntry(diaryEntry);
  }
}

async function updateDiaryEntry({
  id,
  diaryEntry,
  isPublish,
}: UpdateDiaryEntryPayload) {
  diaryEntry.slug = DiaryStatic.generateSlug(diaryEntry);
  diaryEntry.tags = JSON.stringify(diaryEntry.tags);

  await new DiaryMutationBuilder(knex).update(diaryEntry).whereId(id).build();
  if (isPublish && EMAILS_ON) {
    await Emails.notifyNewDiaryEntry(diaryEntry);
  }
}

async function deleteDiaryEntry({ id }: DeleteDiaryEntryPayload) {
  await new DiaryMutationBuilder(knex).delete(id).build();
}

export interface GetAllDiaryOptions {
  sort?: QuerySort<DiaryDAO>;
  status?: DiaryStatusFilters;
  onlyFavourites?: boolean;
}

export interface CreateDiaryEntryPayload {
  diaryEntry: DiaryDAO;
  isPublish: boolean;
}

export interface UpdateDiaryEntryPayload {
  id: number;
  diaryEntry: DiaryDAO;
  isPublish: boolean;
}

export interface DeleteDiaryEntryPayload {
  id: number;
}
