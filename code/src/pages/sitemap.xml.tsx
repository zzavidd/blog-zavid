import { DiaryStatus } from '@prisma/client';
import type { GetServerSideProps, NextPage } from 'next';
import { SitemapStream, streamToPromise } from 'sitemap';

import DiaryAPI from 'server/api/diary';
import PageAPI from 'server/api/pages';
import Settings from 'utils/settings';

const Sitemap: NextPage = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const routes = ['/', '/diary', '/subscribe'];

  const [diaryEntries, pages] = await Promise.all([
    DiaryAPI.findMany({
      where: { status: DiaryStatus.PUBLISHED },
    }),
    PageAPI.findMany({ where: { isEmbed: false } }),
  ]);

  diaryEntries.forEach(({ entryNumber }) =>
    routes.push(`/diary/${entryNumber}`),
  );
  pages.forEach(({ slug }) => routes.push(`/${slug}`));

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
