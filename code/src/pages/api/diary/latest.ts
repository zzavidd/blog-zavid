import type { DiaryDAO } from 'classes';
import { DiaryQueryBuilder, DiaryStatus } from 'classes';
import { knex } from 'src/private/db';

export async function getLatestDiaryEntry(): Promise<DiaryDAO> {
  const [latestDiaryEntry] = await new DiaryQueryBuilder(knex)
    .whereStatus({ include: [DiaryStatus.PUBLISHED] })
    .getLatestEntry()
    .build();
  return latestDiaryEntry;
}
