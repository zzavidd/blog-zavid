import type { PostDAO } from 'classes';
import { PostQueryBuilder, PostType, PostStatus } from 'classes';
import { knex } from 'src/private/db';

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
