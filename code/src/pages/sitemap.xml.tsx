import { DiaryStatus, PostStatus, PostType } from '@prisma/client';
import type { GetServerSideProps, NextPage } from 'next';
import { SitemapStream, streamToPromise } from 'sitemap';

import DiaryAPI from 'server/api/diary';
import PageAPI from 'server/api/pages';
import PostAPI from 'server/api/posts';
import Settings from 'utils/settings';

const Sitemap: NextPage = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const routes = ['/', '/diary', '/subscribe'];

  const [diaryEntries, posts, pages] = await Promise.all([
    DiaryAPI.findMany({
      select: { entryNumber: true },
      where: { status: DiaryStatus.PUBLISHED },
    }),
    PostAPI.findMany({
      select: { slug: true },
      where: { status: PostStatus.PUBLISHED, type: PostType.REVERIE },
    }),
    PageAPI.findMany({ where: { isEmbed: false } }),
  ]);
  const resources = Object.keys(Settings.RESOURCE_MAP);

  diaryEntries.forEach(({ entryNumber }) =>
    routes.push(`/diary/${entryNumber}`),
  );
  posts.forEach(({ slug }) => routes.push(`/reveries/${slug}`));
  pages.forEach(({ slug }) => routes.push(`/${slug}`));
  resources.forEach((slug) => routes.push(`/resources/${slug}`));

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
