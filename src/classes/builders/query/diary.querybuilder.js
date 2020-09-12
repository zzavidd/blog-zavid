const { isFalsy } = require('zavid-modules').zLogic;

const { QueryBuilder, MutationBuilder } = require('./super');

/** Builds a post query with conditions. */
class DiaryQueryBuilder extends QueryBuilder {
  constructor(knex) {
    super(knex, 'diary');
  }

  whereSlug(slug) {
    if (isFalsy(slug)) return this;
    this.query.where('slug', slug);
    return this;
  }

  whereStatus({ include, exclude } = {}) {
    if (!isFalsy(include)) this.query.whereIn('status', include);
    if (!isFalsy(exclude)) this.query.whereNotIn('status', exclude);
    return this;
  }
}

class DiaryMutationBuilder extends MutationBuilder {
  constructor(knex) {
    super(knex, 'diary', 'diary entry');
  }
}

exports.DiaryQueryBuilder = DiaryQueryBuilder;
exports.DiaryMutationBuilder = DiaryMutationBuilder;