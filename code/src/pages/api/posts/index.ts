import type { NextApiRequest, NextApiResponse } from 'next';

import type {
  PostDAO,
  PostStatusFilters,
  PostTypeFilters,
  QuerySort,
} from 'classes';
import { PostQueryBuilder, PostStatic } from 'classes';
import { knex } from 'src/private/db';

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

export type GetAllPostOptions = {
  limit?: number;
  sort: QuerySort;
  status: PostStatusFilters;
  type: PostTypeFilters;
};
