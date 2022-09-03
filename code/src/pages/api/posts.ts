import type { NextApiRequest, NextApiResponse } from 'next';

import type {
  PostDAO,
  PostStatusFilters,
  PostTypeFilters,
  QuerySort,
} from 'classes';
import {
  PostMutationBuilder,
  PostQueryBuilder,
  PostStatic,
  PostStatus,
  PostType,
  QueryOrder,
} from 'classes';
import { knex } from 'constants/knex';
import { EMAILS_ON } from 'constants/settings';
import Emails from 'private/emails';
import Filer from 'private/filer';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
): Promise<void> {
  try {
    switch (req.method) {
      case 'GET': {
        const params = JSON.parse((req.query?.params as string) || '{}');
        const posts = await getAllPosts(params);
        return res.status(200).json(posts);
      }
      case 'POST': {
        await createPost(req.body);
        return res.send(201);
      }
      case 'PUT': {
        await updatePost(req.body);
        return res.send(200);
      }
      case 'DELETE': {
        await deletePost(req.body);
        return res.send(204);
      }
      default: {
        res.send(405);
      }
    }
  } catch (e: any) {
    res.status(400).json({ message: e.message });
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

export async function getPostSSR(payload: GetPostPayload) {
  const posts = await getPost(payload);
  return JSON.stringify(posts);
}

export async function getPostByIdSSR(id: number) {
  return JSON.stringify(await getPostById(id));
}

export async function getPostById(id: number) {
  const [post] = await new PostQueryBuilder(knex).whereId(id).build();
  return post;
}

export async function getDomains() {
  const posts = await getAllPosts({
    sort: {
      field: 'type',
      order: 'DESC',
    },
  });

  const domains = posts.map(({ id, title, type, status }: PostDAO) => {
    return {
      value: id!.toString(),
      label: `${type}: ${title}`,
      type,
      status,
    };
  });

  return domains;
}

export async function getPost({
  slug,
  type,
  statusFilters,
  domainSlug,
  domainType,
}: GetPostPayload) {
  const builder = new PostQueryBuilder(knex)
    .whereSlug(slug)
    .whereType({ include: [type] })
    .whereStatus(statusFilters);

  if (domainSlug) builder.whereDomainSlug(domainSlug);
  if (domainType) builder.whereDomainType(domainType);

  const [current] = await builder.build();

  let previous;
  let next;
  if (type === PostType.PAGE) {
    const [[previousPost], [nextPost]] = await Promise.all([
      new PostQueryBuilder(knex)
        .getPreviousPost(current.typeId!, current.type!)
        .build(),
      new PostQueryBuilder(knex)
        .getNextPost(current.typeId!, current.type!)
        .build(),
    ]);
    previous = previousPost;
    next = nextPost;
  }

  return {
    current,
    previous,
    next,
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

async function createPost({
  post: postToUpload,
  isPublish,
}: CreatePostPayload) {
  const post = await Filer.uploadImages(postToUpload);
  await new PostMutationBuilder(knex).insert(post).build();

  if (isPublish && EMAILS_ON) {
    await Emails.notifyNewPost(post);
  }
}

async function updatePost({
  id,
  post: postToUpload,
  isPublish,
}: UpdatePostPayload) {
  const post = await Filer.replaceImages(id, postToUpload);
  await new PostMutationBuilder(knex).update(post).whereId(id).build();

  if (isPublish && EMAILS_ON) {
    await Emails.notifyNewPost(post);
  }
}

async function deletePost({ id }: DeletePostPayload) {
  const [post] = await new PostQueryBuilder(knex).whereId(id).build();
  const promises = PostStatic.collateImages(post).map(Filer.destroyImage);
  await Promise.all(promises);
  await new PostMutationBuilder(knex).delete(id).build();
}

interface RandomPostOptions {
  exceptId?: number;
}

export interface GetAllPostOptions {
  sort?: QuerySort<PostDAO>;
  status?: PostStatusFilters;
  type?: PostTypeFilters;
  limit?: number;
}

export interface GetPostPayload {
  slug: string;
  type: PostType;
  statusFilters?: PostStatusFilters;
  domainSlug?: string;
  domainType?: PostType;
}

interface CreatePostPayload {
  post: PostDAO;
  isPublish: boolean;
}

export interface UpdatePostPayload {
  id: number;
  post: PostDAO;
  isPublish: boolean;
}

interface DeletePostPayload {
  id: number;
}
