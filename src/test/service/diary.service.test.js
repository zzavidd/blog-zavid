const { assert, debug, fetch } = require('..');
const { Diary, DiaryEntryBuilder } = require('../../classes');
const { GET_DIARY_QUERY } = require('../../private/api/queries/diary.queries');
const {
  submitDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry,
  compareDiaryEntries
} = require('../helper/diary.helper');

describe('Service Tests: Diary', function () {
  describe('Get All Diary Entries', function () {
    it('All', function (finish) {
      fetch(GET_DIARY_QUERY, {}, function ({ data }) {
        assert.isOk(data.diaryEntries);
        finish();
      });
    });
  });

  describe('Create Diary', function () {
    it('Standard', function (finish) {
      const diaryEntry = new DiaryEntryBuilder().random().build();
      submitDiaryEntry(diaryEntry, (readDiaryEntry) => {
        compareDiaryEntries(diaryEntry, readDiaryEntry);
        deleteDiaryEntry(readDiaryEntry.id, finish);
      });
    });

    it('Different statuses', function (finish) {
      const privateDiaryEntry = new DiaryEntryBuilder()
        .random()
        .withStatus(Diary.STATUSES.PRIVATE)
        .build();
      const publishedDiaryEntry = new DiaryEntryBuilder()
        .random()
        .withStatus(Diary.STATUSES.PUBLISHED)
        .build();

      Promise.all([
        submitDiaryEntry(privateDiaryEntry, (readDiaryEntry) => {
          assert.isNotNull(readDiaryEntry.slug);
          deleteDiaryEntry(readDiaryEntry.id);
        }),
        submitDiaryEntry(publishedDiaryEntry, (readDiaryEntry) => {
          assert.isNotNull(readDiaryEntry.slug);
          deleteDiaryEntry(readDiaryEntry.id);
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
        .then((id) => {
          updateDiaryEntry(id, diaryEntryForUpdate, (updatedDiaryEntry) => {
            compareDiaryEntries(diaryEntryForUpdate, updatedDiaryEntry);
            assert.strictEqual(id, updatedDiaryEntry.id);
            deleteDiaryEntry(id, finish);
          });
        })
        .catch(debug);
    });
  });
});
