import type { NextApiRequest, NextApiResponse } from 'next';

import type { DiaryDAO, DiaryStatusFilters, QuerySort } from 'classes';
import {
  DiaryMutationBuilder,
  DiaryQueryBuilder,
  DiaryStatic,
  DiaryStatus,
} from 'classes';
import { knex } from 'constants/knex';

const isProduction = process.env.NODE_ENV === 'production';
const emailsOn = isProduction || process.argv.includes('--emails');
const telegramOn = isProduction || process.argv.includes('--telegram');

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

/**
 * Inserts a new diary entry into the database.
 * @param option.diaryEntry - The diary entry object to be inserted.
 * @param option.isPublish - Indicates if a publish operation.
 */
export async function createDiaryEntry({
  diaryEntry,
  isPublish,
}: CreateDiaryEntryOptions): Promise<void> {
  diaryEntry.slug = DiaryStatic.generateSlug(diaryEntry);
  diaryEntry.tags = JSON.stringify(diaryEntry.tags);

  // const { shouldSendEmail, shouldSendTelegram } = getPermissions(isPublish);

  await new DiaryMutationBuilder(knex).insert(diaryEntry).build();
  // shouldSendEmail ? Emails.notifyNewDiaryEntry(diaryEntry) : null,
  // shouldSendTelegram ? Telegram.notifyNewDiaryEntry(diaryEntry) : null,
}

export async function updateDiaryEntry({
  id,
  diaryEntry,
  isPublish,
}: UpdateDiaryEntryOptions) {
  diaryEntry.slug = DiaryStatic.generateSlug(diaryEntry);
  diaryEntry.tags = JSON.stringify(diaryEntry.tags);

  // const { shouldSendEmail, shouldSendTelegram } = getPermissions(isPublish);

  await new DiaryMutationBuilder(knex).update(diaryEntry).whereId(id).build();
  // shouldSendEmail ? Emails.notifyNewDiaryEntry(diaryEntry) : null,
  // shouldSendTelegram ? Telegram.notifyNewDiaryEntry(diaryEntry) : null,
}

export async function deleteDiaryEntry(id: number) {
  await new DiaryMutationBuilder(knex).delete(id).build();
}

export async function getLatestDiaryEntry(): Promise<DiaryDAO> {
  const [latestDiaryEntry] = await new DiaryQueryBuilder(knex)
    .whereStatus({ include: [DiaryStatus.PUBLISHED] })
    .getLatestEntry()
    .build();
  return latestDiaryEntry;
}

/**
 * Get permissions for notifications based on CLI arguments.
 * @param isPublish Indicates if diary entry was a publish.
 */
function getPermissions(isPublish: boolean) {
  const shouldSendEmail = isPublish && emailsOn;
  const shouldSendTelegram = isPublish && telegramOn;
  return { shouldSendEmail, shouldSendTelegram };
}

export interface GetAllDiaryOptions {
  sort?: QuerySort;
  status?: DiaryStatusFilters;
  onlyFavourites?: boolean;
}

export interface CreateDiaryEntryOptions {
  diaryEntry: DiaryDAO;
  isPublish: boolean;
}

export interface UpdateDiaryEntryOptions {
  id: number;
  diaryEntry: DiaryDAO;
  isPublish: boolean;
}
