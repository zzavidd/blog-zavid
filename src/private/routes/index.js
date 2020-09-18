const diaryRoutes = require('./entities/diary.routes');
const pageRoutes = require('./entities/page.routes');
const postRoutes = require('./entities/post.routes');
const subscriberRoutes = require('./entities/subscriber.routes');
const seoRoutes = require('./seo');

const {
  Post,
  DiaryQueryBuilder,
  PageQueryBuilder,
  PostQueryBuilder
} = require('../../classes');
const { siteTitle } = require('../../constants/settings');
const authRoutes = require('../auth');
const { debug } = require('../error');
const app = require('../singleton').getApp();
const knex = require('../singleton').getKnex();
const server = require('../singleton').getServer();

app.use('/', [
  authRoutes,
  diaryRoutes,
  pageRoutes,
  postRoutes,
  seoRoutes,
  subscriberRoutes
]);

app.get(['/', '/home'], function (req, res) {
  Promise.all([
    new PageQueryBuilder(knex).whereSlug('home').build(),
    new DiaryQueryBuilder(knex).getLatestEntry().build(),
    new PostQueryBuilder(knex)
      .whereType({ exclude: [Post.TYPES.PAGE.TITLE] })
      .whereStatus({ include: [Post.STATUSES.PUBLISHED] })
      .withOrder({ order: Post.ORDER.RANDOM })
      .withLimit(5)
      .build()
  ])
    .then(([[homepage], [latestDiaryEntry], randomPosts]) => {
      return server.render(req, res, '/home', {
        title: siteTitle,
        description: 'Explore the metaphysical manifestation of my mind.',
        ogUrl: '/',
        homeText: homepage.content,
        latestDiaryEntry,
        randomPosts
      });
    })
    .catch(debug);
});
