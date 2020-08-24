const postRoutes = require('./posts.routes');

const { siteTitle } = require('../../constants/settings');
const app = require('../singleton').getApp();
const server = require('../singleton').getServer();

app.use('/', postRoutes);

app.get(['/', '/home'], function (req, res) {
  return server.render(req, res, '/home', {
    title: siteTitle,
    description: 'Enter my complex mind.',
    url: '/'
  });
});
