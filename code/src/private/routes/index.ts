import {
  DiaryQueryBuilder,
  DiaryStatus,
  PageQueryBuilder,
  PostQueryBuilder,
  PostStatus,
  PostType,
  QueryOrder,
} from '../../classes';
import { siteTitle } from '../../constants/settings';
import * as SubscriberService from '../api/service/subscriber.service';
import authRoutes from '../auth';
import * as TelegramAPI from '../notifications/telegram';
import { getApp, getKnex, getServer } from '../singleton';

import diaryRoutes from './entities/diary.routes';
import pageRoutes from './entities/page.routes';
import postRoutes from './entities/post.routes';
import subscriberRoutes from './entities/subscriber.routes';
import linksRoutes from './misc/links';
import seoRoutes from './misc/seo';
import searchRoutes from './search';

const app = getApp();
const knex = getKnex();
const server = getServer();

app.use('/', [
  authRoutes,
  diaryRoutes,
  pageRoutes,
  postRoutes,
  linksRoutes,
  searchRoutes,
  seoRoutes,
  subscriberRoutes,
]);

app.get(['/', '/home'], async function (req, res) {
  const getHomeText = new PageQueryBuilder(knex).whereSlug('home').build();
  const getLatestDiaryEntry = new DiaryQueryBuilder(knex)
    .whereStatus({ include: [DiaryStatus.PUBLISHED] })
    .getLatestEntry()
    .build();
  const getLatestReverie = new PostQueryBuilder(knex)
    .whereType({
      include: [PostType.REVERIE],
    })
    .whereStatus({ include: [PostStatus.PUBLISHED] })
    .getLatestPost()
    .build();

  const [
    [homepage],
    [latestDiaryEntry],
    [latestReverie],
    emailSubscribers,
    tgSubCount,
  ] = await Promise.all([
    getHomeText,
    getLatestDiaryEntry,
    getLatestReverie,
    SubscriberService.getAllSubscribers(),
    TelegramAPI.getSubscriberCount(),
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

  return server.render(req, res, '/home', {
    title: `${siteTitle}: A Galaxy Mind in a Universe World`,
    description: 'Explore the metaphysical manifestation of my mind.',
    ogUrl: '/',
    homeText: homepage.content,
    latestDiaryEntry: JSON.stringify(latestDiaryEntry),
    latestReverie: JSON.stringify(latestReverie),
    randomPosts: JSON.stringify(randomPosts),
    emailSubCount: JSON.stringify(emailSubscribers.length),
    tgSubCount: JSON.stringify(tgSubCount),
  });
});

app.get('/admin', function (req, res) {
  return server.render(req, res, '/admin', {
    title: `Admin Console | ${siteTitle}`,
  });
});
