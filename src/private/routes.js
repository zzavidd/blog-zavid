const { title } = require('../constants/settings.js');

module.exports = (app, conn, server) => {
  /**
   * Home page
   * @route {GET} /home
   */
  app.get(['/', '/home'], function(req, res){
    server.render(req, res, '/home', { 
      title: title,
      description: 'Enter my complex world.',
      url: '/'
    });
  });

  /**
   * Reveries page
   * @route {GET} /reveries
   */
  app.get('/reveries', function(req, res){
    server.render(req, res, '/reveries', { 
      title: `Reveries | ${title}`,
      description: 'For my deeper ruminations...',
      url: '/reveries'
    });
  });

  /**
   * Epistles page
   * @route {GET} /epistles
   */
  app.get('/epistles', function(req, res){
    server.render(req, res, '/epistles', { 
      title: `Epistles | ${title}`,
      description: 'My messages, written to encourage and enlighten; typically based off of Bible scriptures and transcribed as poetry. Read and be blessed.',
      url: '/epistles'
    });
  });

  /**
   * Admin console
   * @route {GET} /admin
   */
  app.get('/admin', function(req, res){
    server.render(req, res, '/admin', { 
      title: `Admin Console`,
      url: '/'
    });
  });
}