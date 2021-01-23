import { zDate } from 'zavid-modules';

import fs from 'fs';
import path from 'path';

import { DiaryEntryBuilder, DiaryStatus } from '../../../classes';
import { createDiaryEntry, updateDiaryEntry } from '../../helper/diary.helper';

const DIARY_ID = 5;
const DIARY_CONTENT = fs.readFileSync(
  path.join(__dirname, '../text/entry.txt'),
  { encoding: 'utf-8' }
);

export async function submitDiary() {
  const entry = new DiaryEntryBuilder().random().build();
  try {
    await createDiaryEntry(entry, {
      extraVariables: { isPublish: true }
    });
    console.info('Notifications sent successfully.'.green);
  } catch (error) {
    console.error((error as string).red);
  }
}

export async function updateDiary() {
  const entry = new DiaryEntryBuilder()
    .random()
    .withContent(DIARY_CONTENT)
    .withDate(zDate.formatISODate(new Date(2020, 8, 13)))
    .withStatus(DiaryStatus.PUBLISHED)
    .build();

  try {
    await updateDiaryEntry(DIARY_ID, entry, {
      extraVariables: { isPublish: true }
    });
    console.info('Notifications sent successfully.'.green);
  } catch (error) {
    console.error((error as string).red);
  }
}
