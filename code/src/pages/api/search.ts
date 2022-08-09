import type { DiaryDAO, PostDAO, ResultEntityDAO } from 'classes';
import {
  DiaryQueryBuilder,
  DiaryStatus,
  PostQueryBuilder,
  PostStatic,
  PostStatus,
  URLBuilder,
} from 'classes';
import { knex } from 'src/private/db';
import { siteTitle } from 'src/settings';

export async function getSearchResults(searchTerm: string, onlyDiary: boolean) {
  const results = await getResultEntities(searchTerm, {
    includePosts: !onlyDiary,
  });
  return JSON.stringify({
    title: `Results for '${searchTerm}' | ${siteTitle}`,
    searchTerm,
    results,
  });
}

async function getResultEntities(
  searchTerm: string,
  options: GetResultEntityOptions = {},
): Promise<ResultEntityDAO[]> {
  let entities: ResultEntityDAO[] = [];
  if (!searchTerm) return entities;

  const { includePosts = true } = options;

  const fields: Array<keyof FilterField> = ['title', 'content', 'tags'];

  // Filter entities by matching search term.
  const filterEntities = (entry: PostDAO | DiaryDAO) => {
    const predicate = (field: keyof FilterField) => {
      const value = entry[field] as string;
      return value && value.toLowerCase().includes(searchTerm.toLowerCase());
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

type FilterField = {
  title: string;
  content: string;
  tags: string;
};

type GetResultEntityOptions = {
  includePosts?: boolean;
};
