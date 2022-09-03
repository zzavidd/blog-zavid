import type { NextApiRequest, NextApiResponse } from 'next';

import type {
  PostDAO,
  PostStatusFilters,
  PostType,
  PostTypeFilters,
  QuerySort,
} from 'classes';
import { PostMutationBuilder, PostQueryBuilder, PostStatic } from 'classes';
import { knex } from 'constants/knex';
import { EMAILS_ON } from 'constants/settings';
import PostAPI from 'private/api/posts';
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
        const posts = await PostAPI.getAll(params);
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
