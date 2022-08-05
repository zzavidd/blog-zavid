import type { PostDAO } from 'classes';
import { PostQueryBuilder, PostType, PostStatus, QueryOrder } from 'classes';
import { knex } from 'src/private/db';

export async function getRandomPosts({
  exceptId
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
