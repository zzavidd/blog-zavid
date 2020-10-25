const express = require('express');
const router = express.Router();
const { zText } = require('zavid-modules');

const { Post, PostQueryBuilder, PageQueryBuilder } = require('../../lib').classes;
const { siteTitle } = require('../../../constants/settings');
const { OPERATIONS } = require('../../../constants/strings');
const { renderErrorPage, ERRORS } = require('../../error');
const knex = require('../../singleton').getKnex();
const server = require('../../singleton').getServer();

router.get(
  '/reveries',
  function (req, res, next) {
    Promise.resolve()
      .then(() => new PageQueryBuilder(knex).whereSlug('reveries').build())
      .then(([reveriePage = {}]) => {
        return server.render(req, res, '/posts/reveries', {
          title: `Reveries | ${siteTitle}`,
          description: 'For my deeper ruminations...',
          ogUrl: '/reveries',
          reveriesIntro: reveriePage.content
        });
      })
      .catch(next);
  },
  renderErrorPage
);

router.get(
  '/reveries/:slug',
  function (req, res, next) {
    const { slug } = req.params;

    Promise.resolve()
      .then(() =>
        new PostQueryBuilder(knex)
          .whereSlug(slug)
          .whereType({ include: [Post.TYPES.REVERIE.TITLE] })
          .build()
      )
      .then(([reverie]) => {
        if (!reverie) throw ERRORS.NO_ENTITY('reverie');
        const { type, typeId } = reverie;
        return Promise.all([
          Promise.resolve(reverie),
          new PostQueryBuilder(knex).getPreviousPost(typeId, type).build(),
          new PostQueryBuilder(knex).getNextPost(typeId, type).build()
        ]);
      })
      .then(([reverie, [previousReverie], [nextReverie]]) => {
        return server.render(req, res, '/posts/single', {
          title: `${reverie.title} | ${siteTitle}`,
          description: reverie.excerpt,
          ogUrl: `/reveries/${slug}`,
          cardImage: reverie.image,
          post: reverie,
          previousPost: previousReverie,
          nextPost: nextReverie
        });
      })
      .catch(next);
  },
  renderErrorPage
);

router.get(
  '/reveries/:domain/:slug',
  function (req, res, next) {
    const { domain, slug } = req.params;
    Promise.resolve()
      .then(() => {
        return new PostQueryBuilder(knex)
          .whereDomainType('Reverie')
          .whereDomainSlug(domain)
          .whereSlug(slug)
          .build();
      })
      .then(([page]) => {
        if (!page) throw ERRORS.NO_ENTITY('page');

        return server.render(req, res, '/posts/single', {
          title: `${page.title} | ${siteTitle}`,
          description: page.excerpt || zText.extractExcerpt(page.content),
          ogUrl: `/reveries/${domain}/${slug}`,
          cardImage: page.image,
          post: page
        });
      })
      .catch(next);
  },
  renderErrorPage
);

// router.get('/epistles', function (req, res) {
//   return server.render(req, res, '/posts/epistles', {
//     title: `Epistles | ${siteTitle}`,
//     description:
//       'My messages, written to encourage and enlighten; typically based off of Bible scriptures and transcribed as poetry. Read and be blessed.',
//     ogUrl: '/epistles'
//   });
// });

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
  new PostQueryBuilder(knex)
    .whereId(id)
    .build()
    .then(([post]) => {
      if (!post) throw ERRORS.NO_ENTITY('post');
      return server.render(req, res, '/posts/crud', {
        title: `Edit Post`,
        operation: OPERATIONS.UPDATE,
        post
      });
    });
});

module.exports = router;
