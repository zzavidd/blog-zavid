import type { Knex } from 'knex';

import { MutationBuilder, QueryBuilder } from 'classes/_/QueryBuilder';
import { IPostStatus, QueryOrder } from 'constants/types';

const TABLE_NAME = 'posts';
const columns = [
  `${TABLE_NAME}.*`,
  'domain.title AS domainTitle',
  'domain.slug AS domainSlug',
  'domain.type AS domainType',
];

/** Builds a post query with conditions. */
export class PostQueryBuilder extends QueryBuilder<PostDAO> {
  constructor(knex: Knex) {
    super(knex.column(columns) as any, TABLE_NAME);
    this.knex = knex;
    void (this.query.leftJoin as Knex.Join<Record<string, unknown>, unknown>)(
      `${TABLE_NAME} AS domain`,
      `${TABLE_NAME}.domainId`,
      '=',
      'domain.id',
    );
  }

  public whereType(filters: PostTypeFilters = {}): PostQueryBuilder {
    const { include, exclude } = filters;
    if (include && include.length)
      void this.query.whereIn(`${TABLE_NAME}.type`, include);
    if (exclude && exclude.length)
      void this.query.whereNotIn(`${TABLE_NAME}.type`, exclude);
    return this;
  }

  public whereStatus(filters: PostStatusFilters = {}): PostQueryBuilder {
    const { include, exclude } = filters;
    if (include && include.length)
      void this.query.whereIn(`${TABLE_NAME}.status`, include);
    if (exclude && exclude.length)
      void this.query.whereNotIn(`${TABLE_NAME}.status`, exclude);
    return this;
  }

  public whereSlug(slug: string): PostQueryBuilder {
    if (!slug) return this;
    void this.query.where(`${TABLE_NAME}.slug`, slug);
    return this;
  }

  public whereDomainType(type?: PostType): PostQueryBuilder {
    if (!type) return this;
    void this.query.where('domain.type', type);
    return this;
  }

  public whereDomainSlug(slug?: string): PostQueryBuilder {
    if (!slug) return this;
    void this.query.where('domain.slug', slug);
    return this;
  }

  public getLatestPost(): PostQueryBuilder {
    void this.query.orderBy('typeId', QueryOrder.DESCENDING).limit(1);
    return this;
  }

  public getPreviousPost(typeId: number, type: PostType): PostQueryBuilder {
    const typeIdField = `${TABLE_NAME}.typeId`;
    void this.query.where({
      [typeIdField]: this.knex(TABLE_NAME)
        .max(typeIdField)
        .where(typeIdField, '<', typeId),
      [`${TABLE_NAME}.type`]: type,
      [`${TABLE_NAME}.status`]: IPostStatus.PUBLISHED,
    });
    return this;
  }

  public getNextPost(typeId: number, type: PostType): PostQueryBuilder {
    const typeIdField = `${TABLE_NAME}.typeId`;
    void this.query.where({
      [typeIdField]: this.knex(TABLE_NAME)
        .min(typeIdField)
        .where(typeIdField, '>', typeId),
      [`${TABLE_NAME}.type`]: type,
      [`${TABLE_NAME}.status`]: IPostStatus.PUBLISHED,
    });
    return this;
  }
}

export class PostMutationBuilder extends MutationBuilder<PostDAO> {
  constructor(knex: Knex) {
    super(knex, TABLE_NAME, 'post');
  }
}

export interface PostTypeFilters {
  include?: PostType[];
  exclude?: PostType[];
}

export interface PostStatusFilters {
  include?: PostStatus[];
  exclude?: PostStatus[];
}
