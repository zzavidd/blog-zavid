const { isFalsy } = require('zavid-modules').zLogic;

const { QueryBuilder, MutationBuilder } = require('./super');

const Diary = require('../../static/diary.static');

/** Builds a post query with conditions. */
class DiaryQueryBuilder extends QueryBuilder {
  constructor(knex) {
    super(knex, 'diary');
    this.knex = knex;
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

  getPreviousEntry(slug) {
    this.query.where(
      'slug',
      this.knex('diary')
        .min('slug')
        .where('slug', '<', slug)
        .andWhere('status', Diary.STATUSES.PUBLISHED)
    );
    return this;
  }

  getNextEntry(slug) {
    this.query.where(
      'slug',
      this.knex('diary')
        .max('slug')
        .where('slug', '>', slug)
        .andWhere('status', Diary.STATUSES.PUBLISHED)
    );
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
