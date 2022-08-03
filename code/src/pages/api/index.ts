import Knex from 'knex';
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
import { SubscriberService } from 'src/private/api/service';
import { siteTitle } from 'src/settings';

if (!process.env.PORT) {
  throw new Error(`No environment variables loaded.`);
}

let database = process.env.MYSQL_NAME!;
if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
  database += 'test';
}

const knex = Knex({
  client: 'mysql',
  connection: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
    database,
    charset: 'utf8mb4'
  }
});

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
    [latestReverie]
    // emailSubscribers
  ] = await Promise.all([
    getHomeText,
    getLatestDiaryEntry,
    getLatestReverie
    // SubscriberService.getAllSubscribers()
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
    title: `${siteTitle}: A Galaxy Mind in a Universe World`,
    description: 'Explore the metaphysical manifestation of my mind.',
    ogUrl: '/',
    homeText: homepage.content,
    latestDiaryEntry,
    latestReverie,
    randomPosts,
    emailSubCount: 0
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
