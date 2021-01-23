import { zDate } from 'zavid-modules';

import { DiaryEntryBuilder, DiaryStatus } from '../../../classes';
import { createDiaryEntry, updateDiaryEntry } from '../../helper/diary.helper';
import { importText, tryWrapper } from '../helper';

const DIARY_ID = 5;
const DIARY_CONTENT = importText('entry-content.txt');
const DIARY_FOOTNOTE = importText('entry-footnote.txt');

export async function submitDiary() {
  const entry = new DiaryEntryBuilder().random().build();
  await tryWrapper(
    createDiaryEntry(entry, {
      extraVariables: { isPublish: true }
    })
  );
}

export async function updateDiary() {
  const entry = new DiaryEntryBuilder()
    .random()
    .withContent(DIARY_CONTENT)
    .withFootnote(DIARY_FOOTNOTE)
    .withDate(zDate.formatISODate(new Date(2020, 8, 13)))
    .withStatus(DiaryStatus.PUBLISHED)
    .build();

  await tryWrapper(
    updateDiaryEntry(DIARY_ID, entry, {
      extraVariables: { isPublish: true }
    })
  );
}
