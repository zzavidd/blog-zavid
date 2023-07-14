import type { Post, Prisma } from '@prisma/client';

import prisma from 'server/prisma';
import { truncateText } from 'utils/lib/text';

export default class PostAPI {
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
}
