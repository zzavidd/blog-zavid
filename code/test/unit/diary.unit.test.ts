import { assert, classes } from '..';
import { zavidBirthday } from '../../src/constants/settings';

const { DiaryStatic, DiaryEntryBuilder } = classes;

describe('Unit Tests: Diary', function () {
  describe('Object methods', function () {
    it('Test random construction', function (finish) {
      const diaryEntry = new DiaryEntryBuilder().random().build();
      assert.hasAllKeys(diaryEntry, [
        'title',
        'content',
        'date',
        'status',
        'entryNumber'
      ]);
      finish();
    });
  });

  describe('Static methods', function () {
    it('Slug generation', function (finish) {
      let diaryEntry = new DiaryEntryBuilder()
        .random()
        .withDate(zavidBirthday)
        .build();
      diaryEntry.slug = DiaryStatic.generateSlug(diaryEntry);

      assert.property(diaryEntry, 'slug');
      assert.deepEqual(
        new Date(diaryEntry.date as string),
        new Date('1996-12-02')
      ),
        finish();
    });
  });
});
