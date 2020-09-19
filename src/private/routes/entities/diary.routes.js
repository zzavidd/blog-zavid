const express = require('express');
const router = express.Router();

const { zDate } = require('zavid-modules');

const { DiaryQueryBuilder } = require('../../../classes');
const { siteTitle } = require('../../../constants/settings');
const { OPERATIONS } = require('../../../constants/strings');
const resolvers = require('../../api/resolvers/diary.resolvers');
const { renderErrorPage, ERRORS } = require('../../error');
const knex = require('../../singleton').getKnex();
const server = require('../../singleton').getServer();

router.get('/diary', function (req, res) {
  return server.render(req, res, '/diary', {
    title: `Diary | ${siteTitle}`,
    description: 'Dear Zavid, how have you been feeling?',
    ogUrl: '/diary'
  });
});

router.get(
  '/diary/:slug',
  function (req, res, next) {
    const { slug } = req.params;

    Promise.all([
      new DiaryQueryBuilder(knex).whereSlug(slug).build(),
      new DiaryQueryBuilder(knex).getPreviousEntry(slug).build(),
      new DiaryQueryBuilder(knex).getNextEntry(slug).build()
    ])
      .then(([[diaryEntry], [previousDiaryEntry], [nextDiaryEntry]]) => {
        if (!diaryEntry) return next(ERRORS.NO_ENTITY('reverie'));
        const date = zDate.formatDate(diaryEntry.date, true);

        return server.render(req, res, '/diary/single', {
          title: `Diary: ${date} | ${siteTitle}`,
          description: diaryEntry.content, // TODO: Deal with absence of excerpt (e.g. pages)
          ogUrl: `/diary/${diaryEntry.slug}`,
          diaryEntry,
          previousDiaryEntry,
          nextDiaryEntry
        });
      })
      .catch(next);
  },
  renderErrorPage
);

router.get('/admin/diary', function (req, res) {
  return server.render(req, res, '/diary/admin', {
    title: `List of Diary Entries`
  });
});

router.get('/admin/diary/add', function (req, res) {
  return server.render(req, res, '/diary/crud', {
    title: `Add New Diary Entry`,
    operation: OPERATIONS.CREATE
  });
});

router.get('/admin/diary/edit/:id', function (req, res) {
  const { id } = req.params;
  resolvers.Query.diaryEntry(undefined, { id }).then((diaryEntry) => {
    return server.render(req, res, '/diary/crud', {
      title: `Edit Diary Entry`,
      operation: OPERATIONS.UPDATE,
      diaryEntry
    });
  });
});

module.exports = router;
