import type { NextApiRequest, NextApiResponse } from 'next';

import type {
  PostDAO,
  PostStatusFilters,
  PostTypeFilters,
  QuerySort,
} from 'classes';
import {
  QueryOrder,
  PostStatus,
  PostQueryBuilder,
  PostStatic,
  PostType,
} from 'classes';
import { knex } from 'constants/knex';
import { siteTitle } from 'constants/settings';

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

export async function getPostSSR(
  slug: string,
  type: PostType,
  statusFilters: PostStatusFilters,
) {
  const posts = await getPost(slug, type, statusFilters);
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

export async function getPost(
  slug: string,
  type: PostType,
  statusFilters: PostStatusFilters,
) {
  const [currentPost] = await new PostQueryBuilder(knex)
    .whereSlug(slug)
    .whereType({ include: [type] })
    .whereStatus(statusFilters)
    .build();

  // const isUnauthorized =
  //   PostStatic.isProtected(reverie) && !req.isAuthenticated();

  // if (!reverie || isUnauthorized) {
  //   return next(ERRORS.NO_ENTITY('reverie'));
  // }

  const [[previousPost], [nextPost]] = await Promise.all([
    new PostQueryBuilder(knex)
      .getPreviousPost(currentPost.typeId!, currentPost.type!)
      .build(),
    new PostQueryBuilder(knex)
      .getNextPost(currentPost.typeId!, currentPost.type!)
      .build(),
  ]);

  return {
    current: currentPost,
    previous: previousPost,
    next: nextPost,
  };
}

export async function getLatestReverie(): Promise<PostDAO> {
  const [getLatestReverie] = await new PostQueryBuilder(knex)
    .whereType({
      include: [PostType.REVERIE],
    })
    .whereStatus({ include: [PostStatus.PUBLISHED] })
    .getLatestPost()
    .build();
  return getLatestReverie;
}

export async function getRandomPosts({
  exceptId,
}: RandomPostOptions): Promise<PostDAO[]> {
  const builder = new PostQueryBuilder(knex)
    .whereType({ exclude: [PostType.PAGE] })
    .whereStatus({ include: [PostStatus.PUBLISHED] });

  if (exceptId) {
    builder.exceptId(exceptId);
  }

  const randomPosts = await builder
    .withOrder({ order: QueryOrder.RANDOM })
    .withLimit(4)
    .build();
  return randomPosts;
}

interface RandomPostOptions {
  exceptId?: number;
}

export interface GetAllPostOptions {
  sort: QuerySort;
  status: PostStatusFilters;
  type: PostTypeFilters;
  limit?: number;
}

export interface GetPostOptions {
  status: PostStatusFilters;
  type: PostType;
}
