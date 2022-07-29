import type {
  PostDAO,
  PostStatusFilters,
  PostTypeFilters,
  QuerySort,
} from '../../../../classes';
import {
  PostMutationBuilder,
  PostQueryBuilder,
  PostStatic,
} from '../../../../classes';
import { ERRORS } from '../../error';
import * as Filer from '../../filer';
import * as Emails from '../../notifications/emails';
import * as Telegram from '../../notifications/telegram';
import { getKnex } from '../../singleton';

import { emailsOn, telegramOn, TryWrapper } from './helper';

const knex = getKnex();
const ENTITY_NAME = 'post';

/**
 * Retrieves all posts from database.
 * @param args.limit Defines the number of results to return.
 * @param args.sort Defines how to order the results.
 * @param args.type The types to filter by.
 * @param args.status The statuses to filter by.
 */
export const getAllPosts = ({
  limit = 0,
  sort,
  type,
  status,
}: GetAllPostOptions): Promise<PostDAO[]> => {
  return TryWrapper(async () => {
    const posts = await new PostQueryBuilder(knex)
      .whereType(type)
      .whereStatus(status)
      .withOrder(sort, { forStringsWithNumbers: true })
      .withLimit(limit)
      .build();
    const parsedPosts = posts.map((post: PostDAO) => PostStatic.parse(post));
    return parsedPosts;
  });
};

/**
 * Retrieves a single post given a specified ID from the database.
 * @param args.id The ID of the post to retrieve.
 */
export const getSinglePost = async ({
  id,
}: GetOrDeletePostOptions): Promise<PostDAO> => {
  return TryWrapper(async () => {
    const [post] = await new PostQueryBuilder(knex).whereId(id).build();
    if (!post) throw ERRORS.NONEXISTENT_ID(id, ENTITY_NAME);
    return PostStatic.parse(post);
  });
};

/**
 * Inserts a new post into the database.
 * @param args.post The post object to be inserted.
 * @param args.isPublish Indicates if a publish operation.
 * @param args.isTest Indicates if testing.
 */
export const createPost = ({
  post,
  isPublish,
  isTest,
}: CreatePostOptions): Promise<PostDAO> => {
  const { shouldSendEmail, shouldSendTelegram } = getPermissions(
    post,
    isPublish,
  );

  return TryWrapper(async () => {
    post = await Filer.uploadImages(post, { isTest });
    const [[id]] = await Promise.all([
      new PostMutationBuilder(knex).insert(post).build(),
      shouldSendEmail ? Emails.notifyNewPost(post) : null,
      shouldSendTelegram ? Telegram.notifyNewPost(post) : null,
    ]);
    return { id };
  });
};

/**
 * Updates the fields of a post in the database.
 * @param args.id - The ID of the post to update.
 * @param args.post - The post object to be updated.
 * @param args.isPublish - Indicates if a publish operation.
 * @param args.isTest - Indicates if testing.
 */
export const updatePost = ({
  id,
  post,
  isPublish,
  isTest,
}: UpdatePostOptions): Promise<PostDAO> => {
  return TryWrapper(async () => {
    const { shouldSendEmail, shouldSendTelegram } = getPermissions(
      post,
      isPublish,
    );

    post = await Filer.replaceImages(id, post, { isTest });
    await Promise.all([
      new PostMutationBuilder(knex).update(post).whereId(id).build(),
      shouldSendEmail ? Emails.notifyNewPost(post) : null,
      shouldSendTelegram ? Telegram.notifyNewPost(post) : null,
    ]);
    return getSinglePost({ id });
  });
};

/**
 * Deletes a post from the database.
 * @param args.id - The ID of the post to delete.
 */
export const deletePost = ({
  id,
}: GetOrDeletePostOptions): Promise<PostDAO> => {
  return TryWrapper(async () => {
    const post = await getSinglePost({ id });
    const promises: Promise<void>[] = [];

    const images = PostStatic.collateImages(post);
    images.forEach((image) => {
      promises.push(Filer.destroyImage(image as string));
    });
    await Promise.all(promises);
    await new PostMutationBuilder(knex).delete(id).build();

    return { id };
  });
};

/**
 * Clears all data from the posts table in the database.
 */
export const clearPosts = () => {
  return TryWrapper(async () => {
    await new PostMutationBuilder(knex).truncate().build();
  });
};

/**
 * Get permissions for notifications based on CLI arguments.
 * @param post The post in question.
 * @param isPublish Indicates if post was a publish.
 */
function getPermissions(post: PostDAO, isPublish: boolean) {
  const isPublishable = isPublish && !PostStatic.isPage(post);
  const shouldSendEmail = isPublishable && emailsOn;
  const shouldSendTelegram = isPublishable && telegramOn;
  return { shouldSendEmail, shouldSendTelegram };
}

export type GetAllPostOptions = {
  limit?: number;
  sort: QuerySort;
  status: PostStatusFilters;
  type: PostTypeFilters;
};

export type GetOrDeletePostOptions = {
  id: number;
};

export type CreatePostOptions = {
  post: PostDAO;
  isPublish: boolean;
  isTest: boolean;
};

export type UpdatePostOptions = {
  id: number;
  post: PostDAO;
  isPublish: boolean;
  isTest: boolean;
};
