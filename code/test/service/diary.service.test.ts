import { assert, testWrapper, promiseWrapper } from '..';
import { DiaryEntryBuilder, DiaryStatus } from '../../classes';
import {
  compareDiaryEntries,
  deleteDiaryEntry,
  getDiaryEntries,
  getSingleDiaryEntry,
  createDiaryEntry,
  updateDiaryEntry
} from '../helper/diary.helper';

describe('Service Tests: Diary', function () {
  describe('Get All Diary Entries', function () {
    it(
      'All',
      testWrapper(async () => {
        const diaryEntries = await getDiaryEntries();
        assert.isOk(diaryEntries);
      })
    );
  });

  describe('Create Diary', function () {
    it(
      'Standard',
      testWrapper(async () => {
        const diaryEntry = new DiaryEntryBuilder().random().build();
        const createdDiaryEntry = await createDiaryEntry(diaryEntry);
        const readDiaryEntry = await getSingleDiaryEntry(createdDiaryEntry.id);
        compareDiaryEntries(diaryEntry, readDiaryEntry);
        await deleteDiaryEntry(readDiaryEntry.id!);
      })
    );

    it('Different statuses', function () {
      const promiseProtected = createDiaryStatusPromise(DiaryStatus.PROTECTED);
      const promisePrivate = createDiaryStatusPromise(DiaryStatus.PRIVATE);
      const promisePublished = createDiaryStatusPromise(DiaryStatus.PUBLISHED);
      return Promise.all([promiseProtected, promisePrivate, promisePublished]);
    });
  });

  describe('Update Diary', function () {
    it(
      'Standard',
      testWrapper(async () => {
        const diaryEntryToSubmit = new DiaryEntryBuilder().random().build();
        const diaryEntryForUpdate = new DiaryEntryBuilder().random().build();

        const createdDiaryEntry = await createDiaryEntry(diaryEntryToSubmit);
        const updatedDiaryEntry = await updateDiaryEntry(
          createdDiaryEntry.id,
          diaryEntryForUpdate
        );

        compareDiaryEntries(diaryEntryForUpdate, updatedDiaryEntry);
        assert.strictEqual(createdDiaryEntry.id, updatedDiaryEntry.id!);
        await deleteDiaryEntry(createdDiaryEntry.id);
      })
    );
  });
});

/**
 * Creates a promise which submits a diary entry with a specified status.
 * @param status The status of the diary entry.
 */
async function createDiaryStatusPromise(status: DiaryStatus) {
  return promiseWrapper(async () => {
    const draftDiaryEntry = new DiaryEntryBuilder()
      .random()
      .withStatus(status)
      .build();
    const createdDiaryEntry = await createDiaryEntry(draftDiaryEntry);
    const readDiaryEntry = await getSingleDiaryEntry(createdDiaryEntry.id);
    assert.isNotNull(readDiaryEntry.slug!);
    await deleteDiaryEntry(readDiaryEntry.id!);
  });
}
