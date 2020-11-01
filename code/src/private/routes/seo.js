const express = require('express');
const router = express.Router();
const { SitemapStream, streamToPromise } = require('sitemap');

const path = require('path');

const {
  PostStatic,
  PostQueryBuilder,
  Diary,
  DiaryQueryBuilder,
  PageQueryBuilder
} = require('../lib').classes;
const { domain } = require('../../constants/settings.js');
const knex = require('../singleton').getKnex();

/** Robots.txt page */
router.get('/robots.txt', (req, res) =>
  res.status(200).sendFile(path.join(__dirname, 'robots.txt'), {
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8'
    }
  })
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
    '/resources/dissertation'
  ];

  const reveries = Promise.resolve()
    .then(() =>
      new PostQueryBuilder(knex)
        .whereType({ include: [PostStatic.TYPE.REVERIE] })
        .whereStatus({ include: [PostStatic.STATUS.PUBLISHED] })
        .build()
    )
    .then((reveries) => {
      reveries.forEach((reverie) => routes.push(`/reveries/${reverie.slug}`));
    });

  const diaryEntries = Promise.resolve()
    .then(() =>
      new DiaryQueryBuilder(knex).whereStatus(Diary.STATUS.PUBLISHED).build()
    )
    .then((diaryEntries) => {
      diaryEntries.forEach((diaryEntry) =>
        routes.push(`/diary/${diaryEntry.slug}`)
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
          changefreq: 'daily'
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

module.exports = router;
