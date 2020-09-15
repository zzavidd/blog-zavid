const { isFalsy } = require('zavid-modules').zLogic;

const { QueryBuilder, MutationBuilder } = require('./super');

const Diary = require('../../static/diary.static');

const TABLE_NAME = 'diary';

/** Builds a post query with conditions. */
class DiaryQueryBuilder extends QueryBuilder {
  constructor(knex) {
    super(knex, TABLE_NAME);
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
      this.knex(TABLE_NAME)
        .min('slug')
        .where('slug', '<', slug) // Less than because dealing with dates
        .andWhere('status', Diary.STATUSES.PUBLISHED)
    );
    return this;
  }

  getNextEntry(slug) {
    this.query.where(
      'slug',
      this.knex(TABLE_NAME)
        .max('slug')
        .where('slug', '>', slug) // Greater than because dealing with dates
        .andWhere('status', Diary.STATUSES.PUBLISHED)
    );
    return this;
  }
}

class DiaryMutationBuilder extends MutationBuilder {
  constructor(knex) {
    super(knex, TABLE_NAME, 'diary entry');
  }
}

exports.DiaryQueryBuilder = DiaryQueryBuilder;
exports.DiaryMutationBuilder = DiaryMutationBuilder;
