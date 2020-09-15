const { Diary, DiaryEntryBuilder } = require('../../classes');
const { updateDiaryEntry } = require('../helper/diary.helper');
const { zDate } = require('zavid-modules');

const DIARY_ID = 5;

const diaryEntryForUpdate = new DiaryEntryBuilder()
  .random()
  .withDate(zDate.formatISODate(new Date(2020, 8, 13)))
  .withStatus(Diary.STATUSES.PUBLISHED)
  .build();

updateDiaryEntry(
  DIARY_ID,
  diaryEntryForUpdate,
  () => {
    console.info('Completed.');
    process.exit(0);
  },
  true
);
