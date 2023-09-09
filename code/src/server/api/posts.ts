import {
  PostStatus,
  type Post,
  type PostType,
  type Prisma,
} from '@prisma/client';
import nodemailer from 'nodemailer';
import invariant from 'tiny-invariant';

import Emailer from 'server/emails';
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
      void Emailer.notifyNewPost(post);
    }
    return post;
  }

  public static async update(
    args: Prisma.PostUpdateArgs,
    isPublish = false,
  ): Promise<Post> {
    const post = await prisma.post.update(args);
    if (isPublish) {
      void Emailer.notifyNewPost(post);
    }
    return post;
  }

  public static async delete(ids: number[]): Promise<void> {
    await prisma.post.deleteMany({ where: { id: { in: ids } } });
  }

  public static async publish(
    id: number,
    previewType: EmailPreviewType,
  ): Promise<string> {
    const post = await this.find({ where: { id } });
    invariant(post, 'No post with ID found.');
    const [info] = await Emailer.notifyNewPost(post, {
      isPreview: true,
      previewType,
    });
    return nodemailer.getTestMessageUrl(info) || '';
  }

  public static async index(id: number, type: PostType): Promise<number> {
    const posts = await prisma.post.findMany({
      where: {
        status: { in: [PostStatus.PRIVATE, PostStatus.PUBLISHED] },
        type,
      },
      orderBy: { datePublished: 'asc' },
    });
    return posts.findIndex((p) => p.id === id) + 1;
  }

  public static async countTypes(): Promise<Record<PostType, number>> {
    const typesByCount = await prisma.post.groupBy({
      by: ['type'],
      _count: { type: true },
    });

    return typesByCount.reduce(
      (acc, a) => {
        acc[a.type] = a._count.type;
        return acc;
      },
      {} as Record<PostType, number>,
    );
  }

  public static async countStatuses(): Promise<Record<PostStatus, number>> {
    const statusesByCount = await prisma.post.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    return statusesByCount.reduce(
      (acc, a) => {
        acc[a.status] = a._count.status;
        return acc;
      },
      {} as Record<PostStatus, number>,
    );
  }
}
