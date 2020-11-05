const { zLogic } = require('zavid-modules');
const { isFalsy } = zLogic;

import { QueryBuilder, MutationBuilder } from './super';

import { PostStatus, PostType, QueryOrder } from '../../interfaces';
import { PostStatic } from '../../static';

const TABLE_NAME = 'posts';
const columns = [
  `${TABLE_NAME}.*`,
  'domain.title AS domainTitle',
  'domain.slug AS domainSlug',
  'domain.type AS domainType'
];

/** Builds a post query with conditions. */
class PostQueryBuilder extends QueryBuilder {
  constructor(knex: any) {
    super(knex.column(columns), TABLE_NAME);
    this.knex = knex;
    this.query.leftJoin(
      `${TABLE_NAME} AS domain`,
      `${TABLE_NAME}.domainId`,
      '=',
      'domain.id'
    );
  }

  whereType(filters: PostTypeFilters = {}): PostQueryBuilder {
    const { include, exclude } = filters;
    if (!isFalsy(include)) this.query.whereIn(`${TABLE_NAME}.type`, include);
    if (!isFalsy(exclude)) this.query.whereNotIn(`${TABLE_NAME}.type`, exclude);
    return this;
  }

  whereStatus(filters: PostStatusFilters = {}): PostQueryBuilder {
    const { include, exclude } = filters;
    if (!isFalsy(include)) this.query.whereIn(`${TABLE_NAME}.status`, include);
    if (!isFalsy(exclude))
      this.query.whereNotIn(`${TABLE_NAME}.status`, exclude);
    return this;
  }

  whereSlug(slug: string): PostQueryBuilder {
    if (isFalsy(slug)) return this;
    this.query.where(`${TABLE_NAME}.slug`, slug);
    return this;
  }

  whereDomainType(type: PostType): PostQueryBuilder {
    if (isFalsy(type)) return this;
    this.query.where('domain.type', type);
    return this;
  }

  whereDomainSlug(slug: string): PostQueryBuilder {
    if (isFalsy(slug)) return this;
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
      [`${TABLE_NAME}.status`]: PostStatic.STATUS.PUBLISHED
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
      [`${TABLE_NAME}.status`]: PostStatic.STATUS.PUBLISHED
    });
    return this;
  }
}

class PostMutationBuilder extends MutationBuilder {
  constructor(knex: any) {
    super(knex, TABLE_NAME, 'post');
  }
}

interface PostTypeFilters {
  include?: PostType[];
  exclude?: PostType[];
}

interface PostStatusFilters {
  include?: PostStatus[];
  exclude?: PostStatus[];
}

exports.PostQueryBuilder = PostQueryBuilder;
exports.PostMutationBuilder = PostMutationBuilder;
