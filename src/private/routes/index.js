const diaryRoutes = require('./entities/diary.routes');
const pageRoutes = require('./entities/page.routes');
const postRoutes = require('./entities/post.routes');
const subscriberRoutes = require('./entities/subscriber.routes');

const seoRoutes = require('./seo');

const { siteTitle } = require('../../constants/settings');
const authRoutes = require('../auth');
const app = require('../singleton').getApp();
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
  return server.render(req, res, '/home', {
    title: siteTitle,
    description: 'Explore the metaphysical manifestation of my mind.',
    url: '/'
  });
});
