import diaryRoutes from './entities/diary.routes';
import pageRoutes from './entities/page.routes';
import postRoutes from './entities/post.routes';
import subscriberRoutes from './entities/subscriber.routes';
import linksRoutes from './links';
import seoRoutes from './seo';

import {
  DiaryDAO,
  DiaryQueryBuilder,
  DiaryStatus,
  PageQueryBuilder,
  PostDAO,
  PostQueryBuilder,
  PostStatic,
  PostStatus,
  PostType,
  QueryOrder,
  ResultEntityDAO,
  URLBuilder
} from '../../../classes';
import { siteTitle } from '../../settings';
import authRoutes from '../auth';
import { getApp, getKnex, getServer } from '../singleton';

const app = getApp();
const knex = getKnex();
const server = getServer();

app.use('/', [
  authRoutes,
  diaryRoutes,
  pageRoutes,
  postRoutes,
  linksRoutes,
  seoRoutes,
  subscriberRoutes
]);

app.get(['/', '/home'], async function (req, res) {
  const getHomeText = new PageQueryBuilder(knex).whereSlug('home').build();
  const getLatestDiaryEntry = new DiaryQueryBuilder(knex)
    .whereStatus({ include: [DiaryStatus.PUBLISHED] })
    .getLatestEntry()
    .build();
  const getLatestReverie = new PostQueryBuilder(knex)
    .whereType({
      include: [PostType.REVERIE]
    })
    .whereStatus({ include: [PostStatus.PUBLISHED] })
    .getLatestPost()
    .build();

  const [[homepage], [latestDiaryEntry], [latestReverie]] = await Promise.all([
    getHomeText,
    getLatestDiaryEntry,
    getLatestReverie
  ]);

  let randomPosts;

  if (latestReverie) {
    randomPosts = await new PostQueryBuilder(knex)
      .whereType({ exclude: [PostType.PAGE] })
      .whereStatus({ include: [PostStatus.PUBLISHED] })
      .exceptId(latestReverie.id!)
      .withOrder({ order: QueryOrder.RANDOM })
      .withLimit(4)
      .build();
  }

  return server.render(req, res, '/home', {
    title: `${siteTitle}: A Galaxy Mind in a Universe World`,
    description: 'Explore the metaphysical manifestation of my mind.',
    ogUrl: '/',
    homeText: homepage.content,
    latestDiaryEntry: JSON.stringify(latestDiaryEntry),
    latestReverie: JSON.stringify(latestReverie),
    randomPosts: JSON.stringify(randomPosts)
  });
});

app.get('/search', async function (req, res) {
  const searchTerm = req.query.term as string;
  const entities = await getResultEntities(searchTerm);

  return server.render(req, res, '/home/search', {
    title: `Results for '${searchTerm}'`,
    searchTerm,
    results: JSON.stringify(entities)
  });
});

app.get('/admin', function (req, res) {
  return server.render(req, res, '/admin', {
    title: `Admin Console | ${siteTitle}`
  });
});

async function getResultEntities(
  searchTerm: string
): Promise<ResultEntityDAO[]> {
  let entities: ResultEntityDAO[] = [];
  if (!searchTerm) return entities;

  searchTerm = searchTerm.toLowerCase();
  const fields: Array<keyof FilterField> = ['title', 'content'];

  const posts = await new PostQueryBuilder(knex)
    .whereStatus({ include: [PostStatus.PUBLISHED] })
    .build();
  const diary = await new DiaryQueryBuilder(knex)
    .whereStatus({ include: [DiaryStatus.PUBLISHED] })
    .build();

  // Filter entities by matching search term.
  const filterEntities = (entry: PostDAO | DiaryDAO) => {
    const predicate = (field: keyof FilterField) => {
      const value = entry[field] as string;
      return value.toLowerCase().includes(searchTerm);
    };
    return fields.some(predicate);
  };

  // Parse posts to fit in result collection.
  const parsedPosts: ResultEntityDAO[] = posts
    .filter(filterEntities)
    .map((post) => {
      if (PostStatic.isEpistle(post)) {
        post.title = `#${post.typeId}: ${post.title}`;
      }

      const url = new URLBuilder();

      if (PostStatic.isPage(post)) {
        const base = PostStatic.getDirectory(post.domainType!);
        url.appendSegment(base).appendSegment(post.domainSlug!);
      } else {
        url.appendSegment(post.type!);
      }

      url.appendSegment(post.slug!);
      post.slug = url.build();

      const { id, title, type, datePublished, content, slug } = post;
      return {
        id,
        title,
        type,
        content,
        slug,
        date: datePublished
      };
    }) as ResultEntityDAO[];

  // Parse diary entries to fit in result collection.
  const parsedDiary: ResultEntityDAO[] = diary
    .filter(filterEntities)
    .map(({ id, title, date, content, entryNumber }) => {
      return {
        id,
        title: `#${entryNumber}: ${title}`,
        type: 'Diary Entry',
        date,
        content,
        slug: `/diary/${entryNumber}`
      };
    }) as ResultEntityDAO[];

  entities = entities.concat(parsedPosts, parsedDiary);
  return entities;
}

type FilterField = {
  title: string;
  content: string;
};
