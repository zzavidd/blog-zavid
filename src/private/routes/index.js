const diaryRoutes = require('./diary.routes');
const pageRoutes = require('./page.routes');
const postRoutes = require('./post.routes');
const subscriberRoutes = require('./subscriber.routes');

const { siteTitle } = require('../../constants/settings');
const authRoutes = require('../auth');
const app = require('../singleton').getApp();
const server = require('../singleton').getServer();

app.use('/', [
  authRoutes,
  diaryRoutes,
  pageRoutes,
  postRoutes,
  subscriberRoutes
]);

app.get(['/', '/home'], function (req, res) {
  return server.render(req, res, '/home', {
    title: siteTitle,
    description: 'Explore the metaphysical manifestation of my mind.',
    url: '/'
  });
});
