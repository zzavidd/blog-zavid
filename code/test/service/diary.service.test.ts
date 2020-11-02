import { assert, debug, fetch } from '..';
import { DiaryDAO, DiaryStatic, DiaryEntryBuilder } from '../../classes';
import { GET_DIARY_QUERY } from '../../src/private/api/queries/diary.queries';
import {
  submitDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry,
  compareDiaryEntries
} from '../helper/diary.helper';

describe('Service Tests: Diary', function () {
  describe('Get All Diary Entries', function () {
    it('All', function (finish) {
      fetch(GET_DIARY_QUERY, {}, function ({ data }: any) {
        assert.isOk(data.diaryEntries);
        finish();
      });
    });
  });

  describe('Create Diary', function () {
    it('Standard', function (finish) {
      const diaryEntry = new DiaryEntryBuilder().random().build();
      submitDiaryEntry(diaryEntry, (readDiaryEntry: DiaryDAO) => {
        compareDiaryEntries(diaryEntry, readDiaryEntry);
        deleteDiaryEntry(readDiaryEntry.id!, finish);
      });
    });

    it('Different statuses', function (finish) {
      const privateDiaryEntry = new DiaryEntryBuilder()
        .random()
        .withStatus(DiaryStatic.STATUS.PRIVATE)
        .build();
      const publishedDiaryEntry = new DiaryEntryBuilder()
        .random()
        .withStatus(DiaryStatic.STATUS.PUBLISHED)
        .build();

      Promise.all([
        submitDiaryEntry(privateDiaryEntry, (readDiaryEntry: DiaryDAO) => {
          assert.isNotNull(readDiaryEntry.slug);
          deleteDiaryEntry(readDiaryEntry.id!);
        }),
        submitDiaryEntry(publishedDiaryEntry, (readDiaryEntry: DiaryDAO) => {
          assert.isNotNull(readDiaryEntry.slug);
          deleteDiaryEntry(readDiaryEntry.id!);
        })
      ])
        .then(() => finish())
        .catch(debug);
    });
  });

  describe('Update Diary', function () {
    it('Standard', function (finish) {
      const diaryEntryToSubmit = new DiaryEntryBuilder().random().build();
      const diaryEntryForUpdate = new DiaryEntryBuilder().random().build();
      Promise.resolve()
        .then(() => {
          return submitDiaryEntry(diaryEntryToSubmit);
        })
        .then((id: number) => {
          updateDiaryEntry(
            id,
            diaryEntryForUpdate,
            (updatedDiaryEntry: DiaryDAO) => {
              compareDiaryEntries(diaryEntryForUpdate, updatedDiaryEntry);
              assert.strictEqual(id, updatedDiaryEntry.id!);
              deleteDiaryEntry(id!, finish);
            }
          );
        })
        .catch(debug);
    });
  });
});
