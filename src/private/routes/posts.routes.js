const express = require('express');
const router = express.Router();

const { PostQueryBuilder } = require('../../classes');
const { siteTitle } = require('../../constants/settings');
const { OPERATIONS } = require('../../constants/strings');
const resolvers = require('../api/resolvers');
const { renderErrorPage, ERRORS } = require('../error');
const knex = require('../singleton').getKnex();
const server = require('../singleton').getServer();

router.get('/reveries', function (req, res) {
  return server.render(req, res, '/posts/reveries', {
    title: `Reveries | ${siteTitle}`,
    description: 'For my deeper ruminations...',
    url: '/reveries'
  });
});

router.get(
  '/reveries/:slug',
  function (req, res, next) {
    const { slug } = req.params;
    Promise.resolve()
      .then(() => new PostQueryBuilder(knex).whereSlug(slug).build())
      .then(([post] = []) => {
        if (!post) return next(ERRORS.NO_REVERIE);
        return server.render(req, res, '/posts/single', {
          title: `${post.title} | ${siteTitle}`,
          description: post.excerpt, // TODO: Deal with absence of excerpt (e.g. pages)
          ogUrl: `/reveries/${post.slug}`,
          cardImage: post.image,
          post
        });
      })
      .catch(next);
  },
  renderErrorPage
);

router.get(
  '/reveries/:domain/:slug',
  function (req, res, next) {
    const { slug } = req.params;
    Promise.resolve()
      .then(() => {
        return new PostQueryBuilder(knex)
          .whereDomainType('Reverie')
          .whereSlug(slug)
          .build();
      })
      .then(([post] = []) => {
        if (!post) return next(ERRORS.NO_REVERIE);
        return server.render(req, res, '/posts/single', {
          title: `${post.title} | ${siteTitle}`,
          description: post.excerpt, // TODO: Deal with absence of excerpt (e.g. pages)
          ogUrl: `/reveries/${post.slug}`,
          cardImage: post.image,
          post
        });
      })
      .catch(next);
  },
  renderErrorPage
);

router.get('/epistles', function (req, res) {
  return server.render(req, res, '/posts/epistles', {
    title: `Epistles | ${siteTitle}`,
    description:
      'My messages, written to encourage and enlighten; typically based off of Bible scriptures and transcribed as poetry. Read and be blessed.',
    url: '/epistles'
  });
});

router.get('/admin/posts', function (req, res) {
  return server.render(req, res, '/posts/admin', {
    title: `List of Posts`
  });
});

router.get('/admin/posts/add', function (req, res) {
  return server.render(req, res, '/posts/crud', {
    title: `Add New Post`,
    operation: OPERATIONS.CREATE
  });
});

router.get('/admin/posts/edit/:id', function (req, res) {
  const { id } = req.params;
  resolvers.Query.getSinglePost({ id }).then((post) => {
    return server.render(req, res, '/posts/crud', {
      title: `Edit Post`,
      operation: OPERATIONS.UPDATE,
      post
    });
  });
});

module.exports = router;
