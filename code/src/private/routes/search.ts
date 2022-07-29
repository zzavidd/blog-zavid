import express from 'express';

import type { DiaryDAO, PostDAO, ResultEntityDAO } from '../../../classes';
import {
  DiaryQueryBuilder,
  DiaryStatus,
  PostQueryBuilder,
  PostStatic,
  PostStatus,
  URLBuilder,
} from '../../../classes';
import { siteTitle } from '../../settings';
import { getKnex, getServer } from '../singleton';

const router = express.Router();
const knex = getKnex();
const server = getServer();

router.get('/search', async function (req, res) {
  const searchTerm = req.query.term as string;
  const onlyDiary = req.query.onlyDiary === 'true';
  const entities = await getResultEntities(searchTerm, {
    includePosts: !onlyDiary,
  });

  const title = searchTerm ? `Results for '${searchTerm}'` : `Search`;

  return server.render(req, res, '/home/search', {
    title: `${title} | ${siteTitle}`,
    searchTerm,
    results: JSON.stringify(entities),
  });
});

export async function getResultEntities(
  searchTerm: string,
  options: GetResultEntityOptions = {},
): Promise<ResultEntityDAO[]> {
  let entities: ResultEntityDAO[] = [];
  if (!searchTerm) return entities;

  const { includePosts = true } = options;

  searchTerm = searchTerm.toLowerCase();
  const fields: Array<keyof FilterField> = ['title', 'content', 'tags'];

  // Filter entities by matching search term.
  const filterEntities = (entry: PostDAO | DiaryDAO) => {
    const predicate = (field: keyof FilterField) => {
      const value = entry[field] as string;
      return value && value.toLowerCase().includes(searchTerm);
    };
    return fields.some(predicate);
  };

  const parsedPosts = includePosts ? await compilePosts(filterEntities) : [];
  const parsedDiary = await compileDiaryEntries(filterEntities);

  entities = entities
    .concat(parsedPosts, parsedDiary)
    .sort((a, b) => {
      if (a.date < b.date) return 1;
      if (a.date > b.date) return -1;
      return 0;
    })
    .map((entity, index) => {
      return {
        ...entity,
        index: index + 1,
      };
    });
  return entities;
}

/**
 * Parse posts to fit in result collection.
 * @param filterBySearchTerm The function used to filter by search term.
 */
async function compilePosts(
  filterBySearchTerm: (entry: PostDAO | DiaryDAO) => boolean,
): Promise<ResultEntityDAO[]> {
  const posts = await new PostQueryBuilder(knex)
    .whereStatus({ include: [PostStatus.PRIVATE, PostStatus.PUBLISHED] })
    .build();

  const parsedPosts = posts.filter(filterBySearchTerm).map((post) => {
    if (!PostStatic.isPage(post)) {
      post.title = `${post.type} #${post.typeId}: ${post.title}`;
    }

    const url = new URLBuilder();

    if (PostStatic.isPage(post)) {
      const base = PostStatic.getDirectory(post.domainType!);
      url.appendSegment(base).appendSegment(post.domainSlug!);
    } else {
      url.appendSegment(PostStatic.getDirectory(post.type!));
    }

    url.appendSegment(post.slug!);
    post.slug = url.build();

    const { title, type, datePublished, content, slug, image } = post;
    return {
      title,
      type,
      content,
      slug,
      image,
      date: datePublished,
    };
  }) as ResultEntityDAO[];

  return parsedPosts;
}

/**
 * Parse diary entries to fit in result collection.
 * @param filterBySearchTerm The function used to filter by search term.
 */
async function compileDiaryEntries(
  filterBySearchTerm: (entry: PostDAO | DiaryDAO) => boolean,
): Promise<ResultEntityDAO[]> {
  const diary = await new DiaryQueryBuilder(knex)
    .whereStatus({ include: [DiaryStatus.PRIVATE, DiaryStatus.PUBLISHED] })
    .build();

  const parsedDiary: ResultEntityDAO[] = diary
    .filter(filterBySearchTerm)
    .map(({ title, date, content, entryNumber }) => {
      return {
        title: `Diary Entry #${entryNumber}: ${title}`,
        type: 'Diary Entry',
        date,
        content,
        slug: `/diary/${entryNumber}`,
      };
    }) as ResultEntityDAO[];

  return parsedDiary;
}

export default router;

type FilterField = {
  title: string;
  content: string;
  tags: string;
};

type GetResultEntityOptions = {
  includePosts?: boolean;
};
