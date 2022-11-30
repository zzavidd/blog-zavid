import { URLBuilder } from 'classes/_/URLBuilder';
import { DiaryQueryBuilder } from 'classes/diary/DiaryQueryBuilder';
import { PostQueryBuilder } from 'classes/posts/PostQueryBuilder';
import { PostStatic } from 'classes/posts/PostStatic';
import { IDiaryStatus, IPostStatus } from 'constants/enums';
import { knex } from 'constants/knex';

namespace SearchAPI {
  export function getResults(searchTerm: string, onlyDiary: boolean) {
    return getResultEntities(searchTerm, {
      includePosts: !onlyDiary,
    });
  }
}

export default SearchAPI;

async function getResultEntities(
  searchTerm: string,
  options: GetResultEntityOptions = {},
): Promise<SearchResultEntityDAO[]> {
  let entities: SearchResultEntityDAO[] = [];
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
): Promise<SearchResultEntityDAO[]> {
  const posts = await new PostQueryBuilder(knex)
    .whereStatus({ include: [IPostStatus.PRIVATE, IPostStatus.PUBLISHED] })
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
  }) as SearchResultEntityDAO[];

  return parsedPosts;
}

/**
 * Parse diary entries to fit in result collection.
 * @param filterBySearchTerm The function used to filter by search term.
 */
async function compileDiaryEntries(
  filterBySearchTerm: (entry: PostDAO | DiaryDAO) => boolean,
): Promise<SearchResultEntityDAO[]> {
  const diary = await new DiaryQueryBuilder(knex)
    .whereStatus({ include: [IDiaryStatus.PRIVATE, IDiaryStatus.PUBLISHED] })
    .build();

  const parsedDiary: SearchResultEntityDAO[] = diary
    .filter(filterBySearchTerm)
    .map(({ title, date, content, entryNumber }) => {
      return {
        title: `Diary Entry #${entryNumber}: ${title}`,
        type: 'Diary Entry',
        date,
        content,
        slug: `/diary/${entryNumber}`,
      };
    }) as SearchResultEntityDAO[];

  return parsedDiary;
}

interface FilterField {
  title: string;
  content: string;
  tags: string;
}

interface GetResultEntityOptions {
  includePosts?: boolean;
}
