import type { NextApiRequest, NextApiResponse, PageConfig } from 'next';

import {
  DiaryQueryBuilder,
  DiaryStatus,
  PageQueryBuilder,
  PostQueryBuilder,
  PostStatus,
  PostType,
  QueryOrder
} from 'classes';
import { knex } from 'src/private/db';
import { siteTitle } from 'src/settings';

import { getAllSubscribers } from './subscribers';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
): Promise<void> {
  if (req.method === 'GET') {
    const json = await getHomePageData();
    res.json(json);
  } else {
    res.send(405);
  }
}

export async function getHomePageData() {
  const getHomeText = new PageQueryBuilder(knex).whereSlug('home').build();
  const getLatestDiaryEntry = new DiaryQueryBuilder(knex)
    .whereStatus({ include: [DiaryStatus.PUBLISHED] })
    .getLatestEntry()
    .build();
  const getLatestReverie = new PostQueryBuilder(knex)
    .whereType({
      include: [PostType.REVERIE]
    })
    .whereStatus({ include: [PostStatus.PUBLISHED] })
    .getLatestPost()
    .build();

  const [
    [homepage],
    [latestDiaryEntry],
    [latestReverie],
    emailSubscribers
  ] = await Promise.all([
    getHomeText,
    getLatestDiaryEntry,
    getLatestReverie,
    getAllSubscribers()
  ]);

  let randomPosts;

  if (latestReverie) {
    randomPosts = await new PostQueryBuilder(knex)
      .whereType({ exclude: [PostType.PAGE] })
      .whereStatus({ include: [PostStatus.PUBLISHED] })
      .exceptId(latestReverie.id!)
      .withOrder({ order: QueryOrder.RANDOM })
      .withLimit(4)
      .build();
  }

  return JSON.stringify({
    homeText: homepage.content,
    latestDiaryEntry,
    latestReverie,
    randomPosts,
    emailSubCount: emailSubscribers?.length || 0
  });
}

export const config: PageConfig = {
  api: {
    bodyParser: {
      sizeLimit: '10MB'
    },
    responseLimit: '2GB'
  }
};
