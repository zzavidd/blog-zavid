import Knex from 'knex';

import { MutationBuilder, QueryBuilder } from './super';

import {
  PostDAO,
  PostStatic,
  PostStatus,
  PostType,
  QueryOrder,
} from '../../index';

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
    (this.query.leftJoin as Knex.Join<Record<string, unknown>, unknown>)(
      `${TABLE_NAME} AS domain`,
      `${TABLE_NAME}.domainId`,
      '=',
      'domain.id',
    );
  }

  whereType(filters: PostTypeFilters = {}): PostQueryBuilder {
    const { include, exclude } = filters;
    if (include && include.length)
      this.query.whereIn(`${TABLE_NAME}.type`, include);
    if (exclude && exclude.length)
      this.query.whereNotIn(`${TABLE_NAME}.type`, exclude);
    return this;
  }

  whereStatus(filters: PostStatusFilters = {}): PostQueryBuilder {
    const { include, exclude } = filters;
    if (include && include.length)
      this.query.whereIn(`${TABLE_NAME}.status`, include);
    if (exclude && exclude.length)
      this.query.whereNotIn(`${TABLE_NAME}.status`, exclude);
    return this;
  }

  whereSlug(slug: string): PostQueryBuilder {
    if (!slug) return this;
    this.query.where(`${TABLE_NAME}.slug`, slug);
    return this;
  }

  whereDomainType(type: PostType): PostQueryBuilder {
    if (!type) return this;
    this.query.where('domain.type', type);
    return this;
  }

  whereDomainSlug(slug: string): PostQueryBuilder {
    if (!slug) return this;
    this.query.where(`domain.slug`, slug);
    return this;
  }

  getLatestPost(): PostQueryBuilder {
    this.query.orderBy('typeId', QueryOrder.DESCENDING).limit(1);
    return this;
  }

  getPreviousPost(typeId: number, type: PostType): PostQueryBuilder {
    const typeIdField = `${TABLE_NAME}.typeId`;
    this.query.where({
      [typeIdField]: this.knex(TABLE_NAME)
        .max(typeIdField)
        .where(typeIdField, '<', typeId),
      [`${TABLE_NAME}.type`]: type,
      [`${TABLE_NAME}.status`]: PostStatic.STATUS.PUBLISHED,
    });
    return this;
  }

  getNextPost(typeId: number, type: PostType): PostQueryBuilder {
    const typeIdField = `${TABLE_NAME}.typeId`;
    this.query.where({
      [typeIdField]: this.knex(TABLE_NAME)
        .min(typeIdField)
        .where(typeIdField, '>', typeId),
      [`${TABLE_NAME}.type`]: type,
      [`${TABLE_NAME}.status`]: PostStatic.STATUS.PUBLISHED,
    });
    return this;
  }
}

export class PostMutationBuilder extends MutationBuilder<PostDAO> {
  constructor(knex: Knex) {
    super(knex, TABLE_NAME, 'post');
  }
}

export type PostTypeFilters = {
  include?: PostType[];
  exclude?: PostType[];
};

export type PostStatusFilters = {
  include?: PostStatus[];
  exclude?: PostStatus[];
};
