import type { NextApiRequest, NextApiResponse } from 'next';

import type { QuerySort } from 'classes/_/QueryBuilder';
import type { DiaryDAO } from 'classes/diary/DiaryDAO';
import type { DiaryStatusFilters } from 'classes/diary/DiaryQueryBuilder';
import { DiaryMutationBuilder } from 'classes/diary/DiaryQueryBuilder';
import { DiaryStatic } from 'classes/diary/DiaryStatic';
import { knex } from 'constants/knex';
import Emails from 'private/emails';

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
      await deleteDiaryEntry(req.body);
      return res.send(204);
    }
    default: {
      res.send(405);
    }
  }
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
  if (isPublish) {
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
  if (isPublish) {
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
