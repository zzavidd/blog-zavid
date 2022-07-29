import * as DiaryService from '../service/diary.service';

/**
 * Retrieves all diary entries from database.
 */
const getAllDiaryEntries = (
  parent: unknown,
  args: DiaryService.GetDiaryOptions,
) => DiaryService.getDiaryEntries(args);

/**
 * Retrieves a single diary entry from database.
 */
const getSingleDiaryEntry = (
  parent: unknown,
  args: DiaryService.GetOrDeleteDiaryEntryOptions,
) => DiaryService.getSingleDiaryEntry(args);

/**
 * Inserts a new diary entry into the database.
 */
const createDiaryEntry = (
  parent: unknown,
  args: DiaryService.CreateDiaryEntryOptions,
) => DiaryService.createDiaryEntry(args);

/**
 * Updates the fields of a diary entry in the database.
 */
const updateDiaryEntry = (
  parent: unknown,
  args: DiaryService.UpdateDiaryEntryOptions,
) => DiaryService.updateDiaryEntry(args);

/**
 * Deletes a diary entry from the database.
 */
const deleteDiaryEntry = (
  parent: unknown,
  args: DiaryService.GetOrDeleteDiaryEntryOptions,
) => DiaryService.deleteDiaryEntry(args);

/**
 * Clears all data from  the posts table in the database.
 */
const clearDiary = () => DiaryService.clearDiary();

export default {
  Query: {
    diaryEntries: getAllDiaryEntries,
    diaryEntry: getSingleDiaryEntry,
  },
  Mutation: {
    createDiaryEntry,
    updateDiaryEntry,
    deleteDiaryEntry,
    clearDiary,
  },
};
