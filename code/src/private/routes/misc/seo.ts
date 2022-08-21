import express from 'express';
import path from 'path';
import { SitemapStream, streamToPromise } from 'sitemap';

import {
  PostStatic,
  PostQueryBuilder,
  DiaryQueryBuilder,
  PageQueryBuilder,
  DiaryStatus,
} from '../../../classes';
import { domain } from '../../../constants/settings';
import { getKnex } from '../../singleton';

const router = express.Router();
const knex = getKnex();

/** Robots.txt page */
router.get('/robots.txt', (req, res) =>
  res.status(200).sendFile(path.join(__dirname, 'robots.txt'), {
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8',
    },
  }),
);

/** Sitemap generated page */
router.get('/sitemap.xml', (req, res) => {
  const routes = [
    '/',
    '/home',
    '/reveries',
    '/diary',
    '/subscribe',
    '/resources/university-thrival-guide',
    '/resources/dissertation',
  ];

  const reveries = Promise.resolve()
    .then(() =>
      new PostQueryBuilder(knex)
        .whereType({ include: [PostStatic.TYPE.REVERIE] })
        .whereStatus({ include: [PostStatic.STATUS.PUBLISHED] })
        .build(),
    )
    .then((reveries) => {
      reveries.forEach((reverie) => routes.push(`/reveries/${reverie.slug}`));
    });

  const diaryEntries = Promise.resolve()
    .then(() =>
      new DiaryQueryBuilder(knex)
        .whereStatus({ include: [DiaryStatus.PUBLISHED] })
        .build(),
    )
    .then((diaryEntries) => {
      diaryEntries.forEach((diaryEntry) =>
        routes.push(`/diary/${diaryEntry.slug}`),
      );
    });

  const pages = Promise.resolve()
    .then(() => new PageQueryBuilder(knex).whereIsEmbed(false).build())
    .then((pages) => {
      pages.forEach((page) => routes.push(`/${page.slug}`));
    });

  Promise.all([reveries, diaryEntries, pages])
    .then(() => {
      const sitemap = new SitemapStream({ hostname: domain });
      routes.forEach((route) => {
        sitemap.write({
          url: route,
          changefreq: 'daily',
        });
      });
      sitemap.end();

      return streamToPromise(sitemap);
    })
    .then((buffer) => {
      const xml = buffer.toString();
      res.header('Content-Type', 'text/xml');
      res.send(xml);
    })
    .catch(console.warn);
});

export default router;
