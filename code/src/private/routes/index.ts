import diaryRoutes from './entities/diary.routes';
import pageRoutes from './entities/page.routes';
import postRoutes from './entities/post.routes';
import subscriberRoutes from './entities/subscriber.routes';
import linksRoutes from './links';
import seoRoutes from './seo';

import {
  DiaryQueryBuilder,
  DiaryStatic,
  PageQueryBuilder,
  PostQueryBuilder,
  PostStatic,
  QueryOrder
} from '../../../classes';
import { siteTitle } from '../../settings';
import authRoutes from '../auth';
import { getApp, getKnex, getServer } from '../singleton';

const app = getApp();
const knex = getKnex();
const server = getServer();

app.use('/', [
  authRoutes,
  diaryRoutes,
  pageRoutes,
  postRoutes,
  linksRoutes,
  seoRoutes,
  subscriberRoutes
]);

app.get(['/', '/home'], async function (req, res) {
  const getHomeText = new PageQueryBuilder(knex).whereSlug('home').build();
  const getLatestDiaryEntry = new DiaryQueryBuilder(knex)
    .whereStatus({ include: [DiaryStatic.STATUS.PUBLISHED] })
    .getLatestEntry()
    .build();
  const getLatestReverie = new PostQueryBuilder(knex)
    .whereType({
      include: [PostStatic.TYPE.REVERIE]
    })
    .whereStatus({ include: [PostStatic.STATUS.PUBLISHED] })
    .getLatestPost()
    .build();

  const [[homepage], [latestDiaryEntry], [latestReverie]] = await Promise.all([
    getHomeText,
    getLatestDiaryEntry,
    getLatestReverie
  ]);

  let randomPosts;

  if (latestReverie) {
    randomPosts = await new PostQueryBuilder(knex)
      .whereType({ exclude: [PostStatic.TYPE.PAGE] })
      .whereStatus({ include: [PostStatic.STATUS.PUBLISHED] })
      .exceptId(latestReverie.id!)
      .withOrder({ order: QueryOrder.RANDOM })
      .withLimit(4)
      .build();
  }

  return server.render(req, res, '/home', {
    title: `${siteTitle}: A Galaxy Mind in a Universe World`,
    description: 'Explore the metaphysical manifestation of my mind.',
    ogUrl: '/',
    homeText: homepage.content,
    latestDiaryEntry: JSON.stringify(latestDiaryEntry),
    latestReverie: JSON.stringify(latestReverie),
    randomPosts: JSON.stringify(randomPosts)
  });
});

app.get('/admin', function (req, res) {
  return server.render(req, res, '/admin', {
    title: `Admin Console | ${siteTitle}`
  });
});
