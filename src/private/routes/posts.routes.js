const express = require('express');
const router = express.Router();

const { siteTitle } = require('../../constants/settings');
const { OPERATIONS } = require('../../constants/strings');
const controller = require('../api/resolvers');
const server = require('../singleton/server').getServer();

router.get('/reveries', function (req, res) {
  return server.render(req, res, '/posts/reveries', {
    title: `Reveries | ${siteTitle}`,
    description: 'For my deeper ruminations...',
    url: '/reveries'
  });
});

router.get('/epistles', function (req, res) {
  return server.render(req, res, '/posts/epistles', {
    title: `Epistles | ${siteTitle}`,
    description:
      'My messages, written to encourage and enlighten; typically based off of Bible scriptures and transcribed as poetry. Read and be blessed.',
    url: '/epistles'
  });
});

router.get('/admin/posts/add', function (req, res) {
  return server.render(req, res, '/posts/crud', {
    title: `Add New Post`,
    hideSidebar: true,
    operation: OPERATIONS.CREATE
  });
});

router.get('/admin/posts/edit/:id', function (req, res) {
  const { id } = req.params;
  controller.getSinglePost({ id }).then((post) => {
    return server.render(req, res, '/posts/crud', {
      title: `Edit Post`,
      hideSidebar: true,
      operation: OPERATIONS.UPDATE,
      post
    });
  });
});

module.exports = router;
