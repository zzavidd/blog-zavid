const postRoutes = require('./posts.routes');

const { siteTitle } = require('../../constants/settings');
const app = require('../singleton/app').getApp();
const server = require('../singleton/server').getServer();

app.use('/', postRoutes);

/**
 * Home page
 * @route {GET} /home
 */
app.get(['/', '/home'], function (req, res) {
  return server.render(req, res, '/home', {
    title: siteTitle,
    description: 'Enter my complex mind.',
    url: '/'
  });
});
