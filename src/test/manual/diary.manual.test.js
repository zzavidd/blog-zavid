const { Diary, DiaryEntryBuilder } = require('../../classes');
const { updateDiaryEntry } = require('../helper/diary.helper');
const { zDate } = require('zavid-modules');

const DIARY_ID = 5;

const DIARY_CONTENT = `
Exercitationem sint vero hic. Culpa rerum omnis magni qui. Ad voluptas dolorum iste tenetur iste eum magnam omnis. Magni rerum laboriosam sunt hic et ut qui.
 
Beatae quo modi maiores nam. **Voluptatem nihil alias placeat qui autem** enim voluptatibus libero accusantium. Quo similique dignissimos et tempore veniam veniam facilis. Recusandae dicta sit enim qui. Dolorum perferendis vel aliquid est. ***Nesciunt magnam voluptates facilis repudiandae ex ab.***

> Et culpa incidunt omnis porro ipsa praesentium.

!{Tweet}(1250122883101327361)

Assumenda repudiandae non est. Velit rem occaecati autem harum mollitia modi. Et ut vel voluptatibus corporis dicta laboriosam facilis maiores. Consequatur ut beatae eum et consequatur harum. Facilis nihil sunt.
`;

const diaryEntryForUpdate = new DiaryEntryBuilder()
  .withContent(DIARY_CONTENT)
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
