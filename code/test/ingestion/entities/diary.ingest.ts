import * as faker from 'faker';
import { zDate, zNumber, zString } from 'zavid-modules';

import { fetch } from '../..';
import { DiaryEntryBuilder, DiaryStatus } from '../../../classes';
import { CREATE_DIARY_QUERY } from '../../../private/api/queries/diary.queries';
import { COUNT } from '../constants';

export async function ingestDiary() {
  console.info(`Ingesting ${COUNT.DIARY} diary entries...`);

  const promises = [];
  let refDate = new Date();

  for (let i = 0; i < COUNT.DIARY; i++) {
    refDate.setDate(refDate.getDate() + 1);
    refDate = faker.date.soon(3, refDate);
    const index = i + 1;
    const diaryEntry = new DiaryEntryBuilder()
      .withTitle(
        zString.toTitleCase(faker.lorem.words(zNumber.generateRandom(1, 3))),
      )
      .withEntryNumber(index)
      .withStatus(DiaryStatus.PUBLISHED)
      .withDate(zDate.formatISODate(refDate))
      .withRandomContent(3, 5)
      .withRandomFootnote()
      .withRandomFavouriteFlag()
      .withRandomTags()
      .build();

    promises.push(
      fetch(CREATE_DIARY_QUERY, {
        variables: { diaryEntry },
      }),
    );
  }

  await Promise.all(promises);
  console.info('Finished ingesting diary entries.');
}
