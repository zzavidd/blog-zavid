const { zLogic } = require('zavid-modules');
const { isFalsy } = zLogic;

const { QueryBuilder, MutationBuilder } = require('./super');

const Post = require('../../static/post.static');

const TABLE_NAME = 'posts';

/** Builds a post query with conditions. */
class PostQueryBuilder extends QueryBuilder {
  constructor(knex) {
    super(knex, TABLE_NAME);
    this.knex = knex;
  }

  whereType({ include, exclude } = {}) {
    if (!isFalsy(include)) this.query.whereIn('type', include);
    if (!isFalsy(exclude)) this.query.whereNotIn('type', exclude);
    return this;
  }

  whereStatus({ include, exclude } = {}) {
    if (!isFalsy(include)) this.query.whereIn('status', include);
    if (!isFalsy(exclude)) this.query.whereNotIn('status', exclude);
    return this;
  }

  whereDomainType(type) {
    if (isFalsy(type)) return this;
    this.query.where('domainType', type);
    return this;
  }

  whereSlug(slug) {
    if (isFalsy(slug)) return this;
    this.query.where('slug', slug);
    return this;
  }

  getPreviousPost(typeId, type) {
    const field = 'typeId';
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
    const field = 'typeId';
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
    super(knex, 'posts', 'post');
  }
}

exports.PostQueryBuilder = PostQueryBuilder;
exports.PostMutationBuilder = PostMutationBuilder;
