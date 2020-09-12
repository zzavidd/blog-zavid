const diaryRoutes = require('./diary.routes');
const postRoutes = require('./posts.routes');

const { siteTitle } = require('../../constants/settings');
const authRoutes = require('../auth');
const app = require('../singleton').getApp();
const server = require('../singleton').getServer();

app.use('/', [authRoutes, diaryRoutes, postRoutes]);

app.get(['/', '/home'], function (req, res) {
  return server.render(req, res, '/home', {
    title: siteTitle,
    description: 'Explore the metaphysical manifestation of my mind.',
    url: '/'
  });
});
