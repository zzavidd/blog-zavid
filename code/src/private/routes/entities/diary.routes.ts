import express, { NextFunction, Request, Response } from 'express';
import { zText } from 'zavid-modules';

import {
  DiaryDAO,
  DiaryQueryBuilder,
  DiaryStatic,
  Operation,
  PageQueryBuilder
} from '../../../../classes';
import { siteTitle } from '../../../constants/settings';
import { ERRORS, renderErrorPage } from '../../error';
import { getKnex, getServer } from '../../singleton';

const router = express.Router();
const knex = getKnex();
const server = getServer();

router.get('/diary', async function (req: Request, res: Response) {
  const [diaryPage] = await new PageQueryBuilder(knex)
    .whereSlug('diary')
    .build();

  const diaryIntro = diaryPage.content || '';

  return server.render(req, res, '/diary', {
    title: `Diary | ${siteTitle}`,
    description: 'Dear Zavid, how have you been feeling?',
    ogUrl: '/diary',
    diaryIntro
  });
});

router.get(
  '/diary/latest',
  async function (req: Request, res: Response, next: NextFunction) {
    const [diaryEntry] = await new DiaryQueryBuilder(knex)
      .whereStatus({ include: [DiaryStatic.STATUS.PUBLISHED] })
      .getLatestEntry()
      .build();

    if (!diaryEntry) return next(ERRORS.NO_ENTITY('diary entry'));

    return res.redirect(`/diary/${diaryEntry.entryNumber}`);
  },
  renderErrorPage
);

router.get(
  '/diary/:slug([0-9]{4}-[0-9]{2}-[0-9]{2})',
  function (req: Request, res: Response, next: NextFunction) {
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
  function (req: Request, res: Response, next: NextFunction) {
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

router.get(
  '/admin/diary/add',
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const [entry] = await new DiaryQueryBuilder(knex)
        .getLatestEntryNumber()
        .build();
      const { latestEntryNumber } = entry as DiaryDAO & {
        latestEntryNumber: number;
      };
      return server.render(req, res, '/diary/crud', {
        title: `Add New Diary Entry`,
        operation: Operation.CREATE,
        latestEntryNumber: latestEntryNumber.toString()
      });
    } catch (err) {
      next(err);
    }
  },
  renderErrorPage
);

router.get('/admin/diary/edit/:id', async function (req, res) {
  const id = req.params.id as unknown;

  const [diaryEntry] = await new DiaryQueryBuilder(knex)
    .whereId(id as number)
    .build();
  return server.render(req, res, '/diary/crud', {
    title: `Edit Diary Entry`,
    operation: Operation.UPDATE,
    diaryEntry: JSON.stringify(diaryEntry)
  });
});

async function serveDiaryEntries(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const promises: Promise<DiaryDAO[][]> = res.locals.promise;
    const [
      [diaryEntry],
      [previousDiaryEntry],
      [nextDiaryEntry]
    ] = await promises;

    const isUnauthorized =
      DiaryStatic.isProtected(diaryEntry) && !req.isAuthenticated();

    if (!diaryEntry || isUnauthorized) {
      return next(ERRORS.NO_ENTITY('diary entry'));
    }

    return server.render(req, res, '/diary/single', {
      title: `Diary Entry #${diaryEntry.entryNumber}: ${diaryEntry.title} | ${siteTitle}`,
      description: zText.extractExcerpt(diaryEntry.content!),
      ogUrl: `/diary/${diaryEntry.slug}`,
      diaryEntry: JSON.stringify(diaryEntry),
      previousDiaryEntry: JSON.stringify(previousDiaryEntry),
      nextDiaryEntry: JSON.stringify(nextDiaryEntry)
    });
  } catch (err) {
    next(err);
  }
}

export default router;
