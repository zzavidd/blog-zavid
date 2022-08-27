import type { GetServerSideProps, NextPage } from 'next';
import { SitemapStream, streamToPromise } from 'sitemap';

import {
  PostQueryBuilder,
  PostStatic,
  DiaryQueryBuilder,
  DiaryStatus,
  PageQueryBuilder,
} from 'classes';
import { knex } from 'constants/knex';
import { domain, RESOURCE_MAP } from 'constants/settings';

// eslint-disable-next-line react/function-component-definition
const Sitemap: NextPage = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const routes = [
    '/',
    '/reveries',
    '/epistles',
    '/diary',
    '/search',
    '/subscribe',
  ];

  const getPosts = new PostQueryBuilder(knex)
    .whereType({ include: [PostStatic.TYPE.REVERIE, PostStatic.TYPE.EPISTLE] })
    .whereStatus({ include: [PostStatic.STATUS.PUBLISHED] })
    .build();
  const getDiaryEntries = await new DiaryQueryBuilder(knex)
    .whereStatus({ include: [DiaryStatus.PUBLISHED] })
    .build();
  const getPages = await new PageQueryBuilder(knex).whereIsEmbed(false).build();

  const [posts, diaryEntries, pages] = await Promise.all([
    getPosts,
    getDiaryEntries,
    getPages,
  ]);

  posts.forEach((post) => {
    if (PostStatic.isReverie(post)) {
      routes.push(`/reveries/${post.slug}`);
    } else if (PostStatic.isEpistle(post)) {
      routes.push(`/epistles/${post.slug}`);
    }
  });
  diaryEntries.forEach((diaryEntry) =>
    routes.push(`/diary/${diaryEntry.entryNumber}`),
  );
  pages.forEach((page) => routes.push(`/${page.slug}`));
  Object.keys(RESOURCE_MAP).forEach((slug) =>
    routes.push(`/resources/${slug}`),
  );

  const sitemap = new SitemapStream({ hostname: domain });
  routes.forEach((route) => {
    sitemap.write({ url: route, changefreq: 'weekly' });
  });
  sitemap.end();

  const buffer = await streamToPromise(sitemap);
  const xml = buffer.toString();

  res.setHeader('Content-Type', 'text/xml');
  res.write(xml);
  res.end();

  return { props: {} };
};

export default Sitemap;
