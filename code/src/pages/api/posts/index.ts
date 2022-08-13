import type { NextApiRequest, NextApiResponse } from 'next';

import type {
  PostDAO,
  PostStatusFilters,
  PostTypeFilters,
  QuerySort,
} from 'classes';
import { PostQueryBuilder, PostStatic, PostStatus, PostType } from 'classes';
import { knex } from 'src/private/db';
import { siteTitle } from 'src/settings';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
): Promise<void> {
  if (req.method === 'GET') {
    const params = JSON.parse(req.query.params as string);
    const json = await getAllPosts(params);
    res.json(json);
  } else {
    res.send(405);
  }
}

export async function getAllPostsSSR(
  options: GetAllPostOptions,
): Promise<string> {
  const posts = await getAllPosts(options);
  return JSON.stringify(posts);
}

export async function getAllPosts({
  limit = 0,
  sort,
  type,
  status,
}: GetAllPostOptions): Promise<PostDAO[]> {
  const posts = await new PostQueryBuilder(knex)
    .whereType(type)
    .whereStatus(status)
    .withOrder(sort, { forStringsWithNumbers: true })
    .withLimit(limit)
    .build();
  return posts.map((post: PostDAO) => PostStatic.parse(post));
}

export async function getReverieBySlugSSR(slug: string) {
  const posts = await getReverieBySlug(slug);
  return JSON.stringify({
    pathDefinition: {
      title: `${posts.current.title} | ${siteTitle}`,
      description: JSON.stringify(posts.current.excerpt),
      url: `/reveries/${slug}`,
      cardImage: JSON.stringify(posts.current.image),
    },
    pageProps: posts,
  });
}

export async function getReverieBySlug(slug: string) {
  const [reverie] = await new PostQueryBuilder(knex)
    .whereSlug(slug)
    .whereType({ include: [PostType.REVERIE] })
    .whereStatus({ exclude: [PostStatus.DRAFT] })
    .build();

  // const isUnauthorized =
  //   PostStatic.isProtected(reverie) && !req.isAuthenticated();

  // if (!reverie || isUnauthorized) {
  //   return next(ERRORS.NO_ENTITY('reverie'));
  // }

  const { type, typeId } = reverie;
  const [[previousReverie], [nextReverie]] = await Promise.all([
    new PostQueryBuilder(knex).getPreviousPost(typeId!, type!).build(),
    new PostQueryBuilder(knex).getNextPost(typeId!, type!).build(),
  ]);

  return {
    current: reverie,
    previous: previousReverie,
    next: nextReverie,
  };
}

export type GetAllPostOptions = {
  limit?: number;
  sort: QuerySort;
  status: PostStatusFilters;
  type: PostTypeFilters;
};
