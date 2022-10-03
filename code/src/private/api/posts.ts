import type { PostDAO } from 'classes/posts/PostDAO';
import { PostType, PostStatus } from 'classes/posts/PostDAO';
import { PostQueryBuilder } from 'classes/posts/PostQueryBuilder';
import { PostStatic } from 'classes/posts/PostStatic';
import { knex } from 'constants/knex';
import { QueryOrder } from 'constants/types';
import type { GetAllPostOptions, GetPostPayload } from 'pages/api/posts';

namespace PostAPI {
  export async function getAll({
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

  export async function getById(id: number) {
    const [post] = await new PostQueryBuilder(knex).whereId(id).build();
    return post;
  }

  export async function getDomains() {
    const posts = await getAll({
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

  export async function getSingle({
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

    let previous, next;
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
      .withLimit(6)
      .build();
    return randomPosts;
  }
}

export default PostAPI;

interface RandomPostOptions {
  exceptId?: number;
}
