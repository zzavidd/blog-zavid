import type { GetServerSideProps, NextPage } from 'next';
import { SitemapStream, streamToPromise } from 'sitemap';

import { DiaryStatus } from 'classes/diary/DiaryDAO';
import { PostStatic } from 'classes/posts/PostStatic';
import { DOMAIN, RESOURCE_MAP } from 'constants/settings';
import DiaryAPI from 'private/api/diary';
import PageAPI from 'private/api/pages';
import PostAPI from 'private/api/posts';

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

  const getPosts = PostAPI.getAll({
    type: { include: [PostStatic.TYPE.REVERIE, PostStatic.TYPE.EPISTLE] },
    status: {
      include: [PostStatic.STATUS.PUBLISHED],
    },
  });
  const getDiaryEntries = DiaryAPI.getAll({
    status: { include: [DiaryStatus.PUBLISHED] },
  });
  const getPages = PageAPI.getAll({ isEmbed: false });
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

  const sitemap = new SitemapStream({ hostname: DOMAIN });
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
