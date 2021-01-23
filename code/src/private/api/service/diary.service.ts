import { TryWrapper, emailsOn, telegramOn } from './helper';

import {
  DiaryDAO,
  DiaryMutationBuilder,
  DiaryQueryBuilder,
  DiaryStatic,
  DiaryStatusFilters,
  QuerySort
} from '../../../../classes';
import { ERRORS } from '../../error';
import * as Emails from '../../notifications/emails';
import * as Telegram from '../../notifications/telegram';
import { getKnex } from '../../singleton';

const knex = getKnex();
const ENTITY_NAME = 'diary entry';

/**
 * Retrieves all diary entries from database.
 * @param option.sort The query sort options.
 * @param option.status The status filters.
 */
export const getDiaryEntries = ({
  sort,
  status,
  onlyFavourites
}: GetDiaryOptions): Promise<DiaryDAO[]> => {
  return TryWrapper(async () => {
    const diaryEntries = await new DiaryQueryBuilder(knex)
      .whereStatus(status)
      .whereIsFavourite(onlyFavourites)
      .withOrder(sort)
      .build();
    return DiaryStatic.parseBatch(diaryEntries);
  });
};

/**
 * Retrieves a single diary entry from database.
 * @param option.id The ID of the diary entry.
 */
export const getSingleDiaryEntry = async ({
  id
}: GetOrDeleteDiaryEntryOptions): Promise<DiaryDAO> => {
  return TryWrapper(async () => {
    const [diaryEntry] = await new DiaryQueryBuilder(knex).whereId(id).build();
    if (!diaryEntry) throw ERRORS.NONEXISTENT_ID(id, ENTITY_NAME);
    return DiaryStatic.parse(diaryEntry);
  });
};

/**
 * Inserts a new diary entry into the database.
 * @param option.diaryEntry - The diary entry object to be inserted.
 * @param option.isPublish - Indicates if a publish operation.
 */
export const createDiaryEntry = async ({
  diaryEntry,
  isPublish
}: CreateDiaryEntryOptions): Promise<DiaryDAO> => {
  diaryEntry.slug = DiaryStatic.generateSlug(diaryEntry);
  diaryEntry.tags = JSON.stringify(diaryEntry.tags);
  
  const { shouldSendEmail, shouldSendTelegram } = getPermissions(
    isPublish
  );

  return TryWrapper(async () => {
    const [[id]] = await Promise.all([
      new DiaryMutationBuilder(knex).insert(diaryEntry).build(),
      shouldSendEmail ? Emails.notifyNewDiaryEntry(diaryEntry) : null,
      shouldSendTelegram ? Telegram.notifyNewDiaryEntry(diaryEntry) : null
    ]);

    return { id } as DiaryDAO;
  });
};

/**
 * Updates the fields of a diary entry in the database.
 * @param options.id - The ID of the diary entry to update.
 * @param options.diaryEntry - The diary entry object to be updated.
 * @param options.isPublish - Indicates if a publish operation.
 */
export const updateDiaryEntry = async ({
  id,
  diaryEntry,
  isPublish
}: UpdateDiaryEntryOptions): Promise<DiaryDAO> => {
  diaryEntry.slug = DiaryStatic.generateSlug(diaryEntry);
  diaryEntry.tags = JSON.stringify(diaryEntry.tags);

  const { shouldSendEmail, shouldSendTelegram } = getPermissions(
    isPublish
  );

  return TryWrapper(async () => {
    await Promise.all([
      new DiaryMutationBuilder(knex).update(diaryEntry).whereId(id).build(),
      shouldSendEmail ? Emails.notifyNewDiaryEntry(diaryEntry) : null,
      shouldSendTelegram ? Telegram.notifyNewDiaryEntry(diaryEntry) : null
    ]);

    const updatedDiaryEntry = await getSingleDiaryEntry({ id });
    return updatedDiaryEntry;
  });
};

/**
 * Deletes a diary entry from the database.
 * @param options.id - The ID of the diary entry to delete.
 */
export const deleteDiaryEntry = async ({
  id
}: GetOrDeleteDiaryEntryOptions): Promise<DiaryDAO> => {
  return TryWrapper(async () => {
    await getSingleDiaryEntry({ id });
    await new DiaryMutationBuilder(knex).delete(id).build();
    return { id };
  });
};

/**
 * Clears all data from the diary table in the database.
 */
export const clearDiary = () => {
  return TryWrapper(async () => {
    await new DiaryMutationBuilder(knex).truncate().build();
  });
};

/**
 * Get permissions for notifications based on CLI arguments.
 * @param isPublish Indicates if diary entry was a publish.
 */
function getPermissions(isPublish: boolean) {
  const shouldSendEmail = isPublish && emailsOn;
  const shouldSendTelegram = isPublish && telegramOn;
  return { shouldSendEmail, shouldSendTelegram };
}

export type GetDiaryOptions = {
  sort: QuerySort;
  status: DiaryStatusFilters;
  onlyFavourites: boolean;
};

export type GetOrDeleteDiaryEntryOptions = {
  id: number;
};

export type CreateDiaryEntryOptions = {
  diaryEntry: DiaryDAO;
  isPublish: boolean;
};

export type UpdateDiaryEntryOptions = {
  id: number;
  diaryEntry: DiaryDAO;
  isPublish: boolean;
};
