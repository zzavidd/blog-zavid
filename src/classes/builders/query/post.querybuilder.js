const { zLogic } = require('zavid-modules');
const { isFalsy } = zLogic;

const { QueryBuilder, MutationBuilder } = require('./super');

const Post = require('../../static/post.static');

const TABLE_NAME = 'posts';
const columns = [
  `${TABLE_NAME}.*`,
  'domain.title AS domainTitle',
  'domain.slug AS domainSlug',
  'domain.type AS domainType'
];

/** Builds a post query with conditions. */
class PostQueryBuilder extends QueryBuilder {
  constructor(knex) {
    super(knex.column(columns), TABLE_NAME);
    this.knex = knex;
    this.query.leftJoin(
      `${TABLE_NAME} AS domain`,
      `${TABLE_NAME}.domainId`,
      '=',
      'domain.id'
    );
  }

  whereType({ include, exclude } = {}) {
    if (!isFalsy(include)) this.query.whereIn(`${TABLE_NAME}.type`, include);
    if (!isFalsy(exclude)) this.query.whereNotIn(`${TABLE_NAME}.type`, exclude);
    return this;
  }

  whereStatus({ include, exclude } = {}) {
    if (!isFalsy(include)) this.query.whereIn(`${TABLE_NAME}.status`, include);
    if (!isFalsy(exclude))
      this.query.whereNotIn(`${TABLE_NAME}.status`, exclude);
    return this;
  }

  whereSlug(slug) {
    if (isFalsy(slug)) return this;
    this.query.where(`${TABLE_NAME}.slug`, slug);
    return this;
  }

  whereDomainType(type) {
    if (isFalsy(type)) return this;
    this.query.where('domain.type', type);
    return this;
  }

  whereDomainSlug(slug) {
    if (isFalsy(slug)) return this;
    this.query.where(`domain.slug`, slug);
    return this;
  }

  getPreviousPost(typeId, type) {
    const field = `${TABLE_NAME}.typeId`;
    this.query.where(
      field,
      this.knex(TABLE_NAME).max(field).where(field, '<', typeId).andWhere({
        status: Post.STATUSES.PUBLISHED,
        type
      })
    );
    return this;
  }

  getNextPost(typeId, type) {
    const field = `${TABLE_NAME}.typeId`;
    this.query.where(
      field,
      this.knex(TABLE_NAME).min(field).where(field, '>', typeId).andWhere({
        status: Post.STATUSES.PUBLISHED,
        type
      })
    );
    return this;
  }
}

class PostMutationBuilder extends MutationBuilder {
  constructor(knex) {
    super(knex, TABLE_NAME, 'post');
  }
}

exports.PostQueryBuilder = PostQueryBuilder;
exports.PostMutationBuilder = PostMutationBuilder;
