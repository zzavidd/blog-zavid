const express = require('express');
const router = express.Router();
const { zText } = require('zavid-modules');

const { PageQueryBuilder } = require('../../lib').classes;
const { siteTitle } = require('../../../constants/settings');
const { OPERATIONS } = require('../../../constants/strings');
const knex = require('../../singleton').getKnex();
const server = require('../../singleton').getServer();

router.get('/:slug', function (req, res, next) {
  const { slug } = req.params;
  Promise.resolve()
    .then(() =>
      new PageQueryBuilder(knex).whereSlug(slug).whereIsEmbed(false).build()
    )
    .then(([page]) => {
      if (!page) return next();
      return server.render(req, res, '/pages/single', {
        title: `${page.title} | ${siteTitle}`,
        description: zText.extractExcerpt(page.content),
        ogUrl: `/${slug}`,
        page
      });
    })
    .catch(next);
});

router.get('/admin/pages', function (req, res) {
  return server.render(req, res, '/pages/admin', {
    title: `List of Pages`
  });
});

router.get('/admin/pages/add', function (req, res) {
  return server.render(req, res, '/pages/crud', {
    title: `Add New Page`,
    operation: OPERATIONS.CREATE
  });
});

router.get('/admin/pages/edit/:id', function (req, res) {
  const { id } = req.params;
  new PageQueryBuilder(knex)
    .whereId(id)
    .build()
    .then(([page]) => {
      return server.render(req, res, '/pages/crud', {
        title: `Edit Page`,
        operation: OPERATIONS.UPDATE,
        page
      });
    });
});

module.exports = router;
