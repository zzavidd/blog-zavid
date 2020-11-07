import express, { NextFunction, Request, Response } from 'express';
import {
  DiaryQueryBuilder,
  DiaryStatic,
  PageQueryBuilder
} from '../../../../classes';
const { siteTitle } = require('../../../constants/settings');
const { OPERATIONS } = require('../../../constants/strings');
const { ERRORS, renderErrorPage } = require('../../error');
import { getKnex, getServer } from '../../singleton';

const router = express.Router();
const { zText } = require('zavid-modules');
const knex = getKnex();
const server = getServer();

router.get(
  '/diary',
  function (req, res, next) {
    Promise.resolve()
      .then(() => new PageQueryBuilder(knex).whereSlug('diary').build())
      .then(([diaryPage = {}]) => {
        return server.render(req, res, '/diary', {
          title: `Diary | ${siteTitle}`,
          description: 'Dear Zavid, how have you been feeling?',
          ogUrl: '/diary',
          diaryIntro: diaryPage.content
        });
      })
      .catch(next);
  },
  renderErrorPage
);

router.get(
  '/diary/latest',
  function (req, res, next) {
    Promise.resolve()
      .then(() =>
        new DiaryQueryBuilder(knex)
          .whereStatus({ include: [DiaryStatic.STATUS.PUBLISHED] })
          .getLatestEntry()
          .build()
      )
      .then(([diaryEntry]) => {
        res.redirect(`/diary/${diaryEntry.entryNumber}`);
      })
      .catch(next);
  },
  renderErrorPage
);

router.get(
  '/diary/:slug([0-9]{4}-[0-9]{2}-[0-9]{2})',
  function (req, res, next) {
    const { slug } = req.params;
    const field = 'slug';

    res.locals.promise = Promise.all([
      new DiaryQueryBuilder(knex).whereSlug(slug).build(),
      new DiaryQueryBuilder(knex).getPreviousEntry(slug, field).build(),
      new DiaryQueryBuilder(knex).getNextEntry(slug, field).build()
    ]);

    next();
  },
  serveDiaryEntries,
  renderErrorPage
);

router.get(
  '/diary/:number([0-9]+)',
  function (req, res, next) {
    const number = parseInt(req.params.number);
    const field = 'entryNumber';

    res.locals.promise = Promise.all([
      new DiaryQueryBuilder(knex).whereEntryNumber(number).build(),
      new DiaryQueryBuilder(knex).getPreviousEntry(number, field).build(),
      new DiaryQueryBuilder(knex).getNextEntry(number, field).build()
    ]);
    next();
  },
  serveDiaryEntries,
  renderErrorPage
);

router.get('/admin/diary', function (req, res) {
  return server.render(req, res, '/diary/admin', {
    title: `List of Diary Entries`
  });
});

router.get('/admin/diary/add', function (req, res) {
  Promise.resolve()
    .then(() => {
      return new DiaryQueryBuilder(knex).getLatestEntryNumber().build();
    })
    .then(([{ latestEntryNumber }]) => {
      return server.render(req, res, '/diary/crud', {
        title: `Add New Diary Entry`,
        operation: OPERATIONS.CREATE,
        latestEntryNumber
      });
    });
});

router.get('/admin/diary/edit/:id', async function (req, res) {
  const id = req.params.id as unknown;

  const [diaryEntry] = await new DiaryQueryBuilder(knex)
    .whereId(id as number)
    .build();
  return server.render(req, res, '/diary/crud', {
    title: `Edit Diary Entry`,
    operation: OPERATIONS.UPDATE,
    diaryEntry
  });
});

async function serveDiaryEntries(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const [[diaryEntry], [previousDiaryEntry], [nextDiaryEntry]] = await res
      .locals.promise;

    if (!diaryEntry) return next(ERRORS.NO_ENTITY('diary entry'));

    return server.render(req, res, '/diary/single', {
      title: `Diary Entry #${diaryEntry.entryNumber}: ${diaryEntry.title} | ${siteTitle}`,
      description: zText.extractExcerpt(diaryEntry.content),
      ogUrl: `/diary/${diaryEntry.slug}`,
      diaryEntry,
      previousDiaryEntry,
      nextDiaryEntry
    });
  } catch (err) {
    next(err);
  }
}

module.exports = router;
