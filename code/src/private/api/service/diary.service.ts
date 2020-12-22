import { TryWrapper, emailsOn } from './helper';

import {
  DiaryDAO,
  DiaryMutationBuilder,
  DiaryQueryBuilder,
  DiaryStatic,
  DiaryStatusFilters,
  QuerySort
} from '../../../../classes';
import * as Emails from '../../emails';
import { ERRORS } from '../../error';
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
    return diaryEntries;
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
    return diaryEntry;
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
  const shouldNotify = isPublish && emailsOn;

  return TryWrapper(async () => {
    const [[id]] = await Promise.all([
      new DiaryMutationBuilder(knex).insert(diaryEntry).build(),
      shouldNotify ? Emails.notifyNewDiaryEntry(diaryEntry) : null
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
  const shouldNotify = isPublish && emailsOn;

  return TryWrapper(async () => {
    await Promise.all([
      new DiaryMutationBuilder(knex).update(diaryEntry).whereId(id).build(),
      shouldNotify ? Emails.notifyNewDiaryEntry(diaryEntry) : null
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
