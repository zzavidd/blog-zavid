import type { Post, Prisma } from '@prisma/client';

import prisma from 'server/prisma';
import { truncateText } from 'utils/lib/text';

export default class PostAPI {
  public static async findMany(
    args: Prisma.PostFindManyArgs,
    options: FindOptions = {},
  ): Promise<Post[]> {
    const { contentWordLimit } = options;
    let posts = await prisma.post.findMany(args);
    if (contentWordLimit) {
      posts = posts.map((entry) => {
        entry.content = truncateText(entry.content, {
          limit: contentWordLimit,
        });
        return entry;
      });
    }
    return posts;
  }

  public static async find(
    args: Prisma.PostFindFirstArgs,
    options: FindOptions = {},
  ): Promise<Post | null> {
    const { contentWordLimit } = options;
    const entry = await prisma.post.findFirst(args);
    if (entry && contentWordLimit) {
      entry.content = truncateText(entry.content, {
        limit: contentWordLimit,
      });
    }
    return entry;
  }

  public static async create(
    args: Prisma.PostCreateArgs,
    isPublish = false,
  ): Promise<Post> {
    const post = await prisma.post.create(args);
    if (isPublish) {
      //   void Emailer.notifyNewDiaryEntry(diary);
    }
    return post;
  }

  public static async update(
    args: Prisma.PostUpdateArgs,
    isPublish = false,
  ): Promise<Post> {
    const post = await prisma.post.update(args);
    if (isPublish) {
      //   void Emailer.notifyNewDiaryEntry(diary);
    }
    return post;
  }

  public static async delete(ids: number[]): Promise<void> {
    await prisma.post.deleteMany({ where: { id: { in: ids } } });
  }
}
