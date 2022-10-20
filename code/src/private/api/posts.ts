import { getPlaiceholder } from 'plaiceholder';

import type { PostDAO } from 'classes/posts/PostDAO';
import { PostType, PostStatus } from 'classes/posts/PostDAO';
import { PostQueryBuilder } from 'classes/posts/PostQueryBuilder';
import { PostStatic } from 'classes/posts/PostStatic';
import { knex } from 'constants/knex';
import { CLOUDINARY_BASE_URL } from 'constants/settings';
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
    const promises = posts.map((post: PostDAO) => {
      return addPlaceholderImage(PostStatic.parse(post));
    });
    return Promise.all(promises);
  }

  export async function getById(id: number): Promise<PostDAO> {
    const [post] = await new PostQueryBuilder(knex).whereId(id).build();
    return await addPlaceholderImage(post);
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

    const [currentPost] = await builder.build();
    const current = await addPlaceholderImage(currentPost);

    let previous: PostDAO | undefined;
    let next: PostDAO | undefined;
    if (type !== PostType.PAGE) {
      const [[previousPost], [nextPost]] = await Promise.all([
        new PostQueryBuilder(knex)
          .getPreviousPost(current.typeId!, current.type!)
          .build(),
        new PostQueryBuilder(knex)
          .getNextPost(current.typeId!, current.type!)
          .build(),
      ]);
      previous = await addPlaceholderImage(previousPost);
      next = await addPlaceholderImage(nextPost);
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
    return addPlaceholderImage(getLatestReverie);
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
      .withLimit(15)
      .build();
    return Promise.all(randomPosts.map(addPlaceholderImage));
  }
}

async function addPlaceholderImage(post: PostDAO): Promise<PostDAO> {
  if (!post || !post.image) return post;

  const { base64 } = await getPlaiceholder(
    `${CLOUDINARY_BASE_URL}/${post.image}`,
  );
  post.imagePlaceholder = base64;
  return post;
}

export default PostAPI;

interface RandomPostOptions {
  exceptId?: number;
}
