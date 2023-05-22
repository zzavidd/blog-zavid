import type { GetServerSideProps, NextPage } from 'next';
import { SitemapStream, streamToPromise } from 'sitemap';

import { PostStatic } from 'classes/posts/PostStatic';
import { IDiaryStatus, IPostStatus, IPostType } from 'constants/enums';
import Settings from 'constants/settings';
import PostAPI from 'private/api/posts';
import DiaryAPI from 'server/api/diary';
import PageAPI from 'server/api/pages';

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
    type: { include: [IPostType.REVERIE, IPostType.EPISTLE] },
    status: {
      include: [IPostStatus.PUBLISHED],
    },
  });
  const getDiaryEntries = DiaryAPI.getAll({
    status: { include: [IDiaryStatus.PUBLISHED] },
  });
  const getPages = PageAPI.findMany({ isEmbed: false });
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
  Object.keys(Settings.RESOURCE_MAP).forEach((slug) =>
    routes.push(`/resources/${slug}`),
  );

  const sitemap = new SitemapStream({ hostname: Settings.DOMAIN });
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
