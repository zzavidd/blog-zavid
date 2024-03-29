import { DiaryStatus, PostStatus, PostType } from '@prisma/client';

import DiaryAPI from 'server/api/diary';
import MoodAPI from 'server/api/mood';
import PageAPI from 'server/api/pages';
import PostAPI from 'server/api/posts';
import { WishlistAPI } from 'server/api/wishlist';
import Settings from 'utils/settings';

import { DOMAINS } from '.';

export async function getPublicRoutes(): Promise<Route[]> {
  const [diaryEntries, posts, pages, lastMood, lastWishlistItem] =
    await Promise.all([
      DiaryAPI.findMany({
        select: { entryNumber: true, date: true },
        where: { status: DiaryStatus.PUBLISHED },
      }),
      PostAPI.findMany({
        select: { datePublished: true, slug: true, type: true },
        where: {
          status: PostStatus.PUBLISHED,
          type: { notIn: [PostType.PASSAGE] },
          // TODO: Use flag for noindex
          title: {
            not: {
              contains: 'appreciation',
            },
          },
        },
      }),
      PageAPI.findMany({
        select: { slug: true, lastModified: true },
        where: { isEmbed: false },
      }),
      MoodAPI.find({ select: { date: true }, orderBy: { date: 'desc' } }),
      WishlistAPI.find({
        select: { createTime: true },
        orderBy: { createTime: 'desc' },
      }),
    ]);
  const resources = Object.keys(Settings.RESOURCE_MAP);
  const lastDiaryEntryDate = diaryEntries.at(-1)?.date;

  const routes: Route[] = [
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
    {
      url: '/mood',
      priority: 1,
      lastmod: lastMood?.date,
      changefreq: 'daily',
    },
    {
      url: '/wishlist',
      priority: 1,
      lastmod: lastWishlistItem?.createTime,
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
    const domain = DOMAINS[post.type].collection;
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

  return routes;
}

interface Route {
  url: string;
  priority: number;
  changefreq: string;
  lastmod?: Date | null;
}
