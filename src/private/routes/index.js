const diaryRoutes = require('./entities/diary.routes');
const pageRoutes = require('./entities/page.routes');
const postRoutes = require('./entities/post.routes');
const subscriberRoutes = require('./entities/subscriber.routes');
const linksRoutes = require('./links');
const seoRoutes = require('./seo');

const {
  Post,
  PostQueryBuilder,
  Diary,
  DiaryQueryBuilder,
  PageQueryBuilder
} = require('../../classes');
const { siteTitle } = require('../../constants/settings');
const { ORDER } = require('../../constants/strings');
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
  linksRoutes,
  seoRoutes,
  subscriberRoutes
]);

app.get(['/', '/home'], function (req, res) {
  const getHomeText = new PageQueryBuilder(knex).whereSlug('home').build();
  const getLatestDiaryEntry = new DiaryQueryBuilder(knex)
    .whereStatus({ include: [Diary.STATUSES.PUBLISHED] })
    .getLatestEntry()
    .build();
  const getLatestReverie = new PostQueryBuilder(knex)
    .whereType({
      include: [Post.TYPES.REVERIE.TITLE]
    })
    .whereStatus({ include: [Post.STATUSES.PUBLISHED] })
    .getLatestPost()
    .build();
  const getRandomPosts = (id) => {
    return new PostQueryBuilder(knex)
      .whereType({ exclude: [Post.TYPES.PAGE.TITLE] })
      .whereStatus({ include: [Post.STATUSES.PUBLISHED] })
      .exceptId(id)
      .withOrder({ order: ORDER.RANDOM })
      .withLimit(4)
      .build();
  };

  Promise.all([getHomeText, getLatestDiaryEntry, getLatestReverie])
    .then((results) => {
      const [[homepage], [latestDiaryEntry], [latestReverie]] = results;
      return Promise.all([
        Promise.resolve(homepage),
        Promise.resolve(latestDiaryEntry),
        Promise.resolve(latestReverie),
        getRandomPosts(latestReverie.id)
      ]);
    })
    .then(([homepage, latestDiaryEntry, latestReverie, randomPosts]) => {
      return server.render(req, res, '/home', {
        title: `${siteTitle}: A Galaxy Mind in a Universe World`,
        description: 'Explore the metaphysical manifestation of my mind.',
        ogUrl: '/',
        homeText: homepage.content,
        latestDiaryEntry,
        latestReverie,
        randomPosts
      });
    })
    .catch(debug);
});

app.get('/admin', function (req, res) {
  return server.render(req, res, '/admin', {
    title: `Admin Console | ${siteTitle}`
  });
});
