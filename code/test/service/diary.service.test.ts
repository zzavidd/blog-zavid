import { assert, testWrapper, promiseWrapper } from '..';
import { DiaryEntryBuilder, DiaryStatus } from '../../classes';
import {
  compareDiaryEntries,
  deleteDiaryEntry,
  getDiaryEntries,
  getSingleDiaryEntry,
  submitDiaryEntry,
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
        const createdDiaryEntry = await submitDiaryEntry(diaryEntry);
        const readDiaryEntry = await getSingleDiaryEntry(createdDiaryEntry.id);
        compareDiaryEntries(diaryEntry, readDiaryEntry);
        await deleteDiaryEntry(readDiaryEntry.id!);
      })
    );

    it('Different statuses', function () {
      const promisePrivate = promiseWrapper(async () => {
        const draftDiaryEntry = new DiaryEntryBuilder()
          .random()
          .withStatus(DiaryStatus.PRIVATE)
          .build();
        const createdDiaryEntry = await submitDiaryEntry(draftDiaryEntry);
        const readDiaryEntry = await getSingleDiaryEntry(createdDiaryEntry.id);
        assert.isNotNull(readDiaryEntry.slug!);
        await deleteDiaryEntry(readDiaryEntry.id!);
      });

      const promisePublished = promiseWrapper(async () => {
        const draftDiaryEntry = new DiaryEntryBuilder()
          .random()
          .withStatus(DiaryStatus.PUBLISHED)
          .build();
        const createdDiaryEntry = await submitDiaryEntry(draftDiaryEntry);
        const readDiaryEntry = await getSingleDiaryEntry(createdDiaryEntry.id);
        assert.isNotNull(readDiaryEntry.slug!);
        await deleteDiaryEntry(readDiaryEntry.id!);
      });

      return Promise.all([promisePrivate, promisePublished]);
    });
  });

  describe('Update Diary', function () {
    it(
      'Standard',
      testWrapper(async () => {
        const diaryEntryToSubmit = new DiaryEntryBuilder().random().build();
        const diaryEntryForUpdate = new DiaryEntryBuilder().random().build();

        const createdDiaryEntry = await submitDiaryEntry(diaryEntryToSubmit);
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
