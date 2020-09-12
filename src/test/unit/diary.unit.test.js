const { assert } = require('..');
const { Diary, DiaryEntryBuilder } = require('../../classes');
const { zavidBirthday } = require('../../constants/settings');

describe('Unit Tests: Post', function () {
  describe('Object methods', function () {
    it('Test random construction', function (finish) {
      const diaryEntry = new DiaryEntryBuilder().random().build();
      assert.hasAllKeys(diaryEntry, ['content', 'date', 'status']);
      finish();
    });
  });

  describe('Static methods', function () {
    it('Slug generation', function (finish) {
      let diaryEntry = new DiaryEntryBuilder()
        .random()
        .withDate(zavidBirthday)
        .build();
      diaryEntry.slug = Diary.generateSlug(diaryEntry);

      assert.property(diaryEntry, 'slug');
      assert.deepEqual(new Date(diaryEntry.date), new Date('1996-12-02')),
        finish();
    });
  });
});
