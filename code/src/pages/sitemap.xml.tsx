import { DiaryStatus, PostStatus, PostType } from '@prisma/client';
import type { GetServerSideProps, NextPage } from 'next';
import { SitemapStream, streamToPromise } from 'sitemap';

import DiaryAPI from 'server/api/diary';
import PageAPI from 'server/api/pages';
import PostAPI from 'server/api/posts';
import { getDomainFromPostType } from 'utils/functions';
import Settings from 'utils/settings';

const Sitemap: NextPage = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const [diaryEntries, posts, pages] = await Promise.all([
    DiaryAPI.findMany({
      select: { entryNumber: true, date: true },
      where: { status: DiaryStatus.PUBLISHED },
    }),
    PostAPI.findMany({
      select: { datePublished: true, slug: true, type: true },
      where: {
        status: PostStatus.PUBLISHED,
        type: { in: [PostType.REVERIE, PostType.MUSING] },
      },
    }),
    PageAPI.findMany({
      select: { slug: true, lastModified: true },
      where: { isEmbed: false },
    }),
  ]);
  const resources = Object.keys(Settings.RESOURCE_MAP);

  const lastDiaryEntryDate = diaryEntries.at(-1)?.date;

  const routes = [
    {
      url: '/',
      priority: 1,
      lastmod: lastDiaryEntryDate,
      changefreq: 'weekly',
    },
    {
      url: '/diary',
      priority: 1,
      lastmod: lastDiaryEntryDate,
      changefreq: 'weekly',
    },
    { url: '/subscribe', priority: 0.3, changefreq: 'never' },
  ];

  diaryEntries.forEach(({ entryNumber, date }) =>
    routes.push({
      url: `/diary/${entryNumber}`,
      priority: 0.7,
      lastmod: date,
      changefreq: 'monthly',
    }),
  );
  posts.forEach((post) => {
    const domain = getDomainFromPostType(post);
    routes.push({
      url: `/${domain}/${post.slug}`,
      priority: 0.7,
      lastmod: post.datePublished,
      changefreq: 'monthly',
    });
  });
  pages.forEach(({ lastModified, slug }) =>
    routes.push({
      url: `/${slug}`,
      priority: 0.3,
      lastmod: lastModified,
      changefreq: 'yearly',
    }),
  );
  resources.forEach((slug) =>
    routes.push({
      url: `/resources/${slug}`,
      priority: 0.3,
      changefreq: 'never',
    }),
  );

  const sitemap = new SitemapStream({ hostname: Settings.DOMAIN });
  routes.forEach((route) => sitemap.write(route));
  sitemap.end();

  const buffer = await streamToPromise(sitemap);
  const xml = buffer.toString();

  res.setHeader('Content-Type', 'text/xml');
  res.write(xml);
  res.end();

  return { props: {} };
};

export default Sitemap;
