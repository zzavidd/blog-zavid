import { DiaryStatic, DiaryEntryBuilder } from '../../classes';
import { createDiaryEntry, updateDiaryEntry } from '../helper/diary.helper';
import { zDate } from 'zavid-modules';

export async function submitDiary() {
  const entry = new DiaryEntryBuilder().random().build();
  await createDiaryEntry(entry, {
    extraVariables: { isPublish: true }
  });
  console.info('Completed.');
  process.exit(0);
}

export async function updateDiary() {
  const entry = new DiaryEntryBuilder()
    .random()
    .withContent(DIARY_CONTENT)
    .withDate(zDate.formatISODate(new Date(2020, 8, 13)))
    .withStatus(DiaryStatic.STATUS.PUBLISHED)
    .build();

  await updateDiaryEntry(DIARY_ID, entry, {
    extraVariables: { isPublish: true }
  });
  console.info('Completed.');
  process.exit(0);
}

const DIARY_ID = 5;
const DIARY_CONTENT = `
Exercitationem sint vero hic. Culpa rerum omnis magni qui. Ad voluptas dolorum iste tenetur iste eum magnam omnis. Magni rerum laboriosam sunt hic et ut qui.
  
Beatae [quo modi maiores](/) nam. **Voluptatem nihil alias placeat qui autem** enim voluptatibus libero accusantium. Quo similique dignissimos et tempore veniam veniam facilis. Recusandae dicta sit enim qui. Dolorum perferendis vel aliquid est. ***Nesciunt magnam voluptates facilis repudiandae ex ab.***

---

![I swear](https://media4.giphy.com/media/LOunc9cOc7x0C3ARtd/giphy.gif?cid=ecf05e4761db58a1692c1b2a998f168d82f81f563a875604&rid=giphy.gif)

Hello my friend.

> Et culpa incidunt omnis porro ipsa praesentium.

!{Tweet}(1250122883101327361)

!{Insta}(https://www.instagram.com/p/CFvAEntpN2g/?utm_source=ig_web_copy_link)

!{Soundcloud}(https://soundcloud.com/musiqcity/i-will-taste-medley)

Assumenda repudiandae non est. Velit rem occaecati autem harum mollitia modi. Et ut vel voluptatibus corporis dicta laboriosam facilis maiores. Consequatur ut beatae eum et consequatur harum. Facilis nihil sunt.
  `;
