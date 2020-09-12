const { QueryBuilder, MutationBuilder } = require('./super');

/** Builds a post query with conditions. */
class DiaryQueryBuilder extends QueryBuilder {
  constructor(knex) {
    super(knex, 'diary');
  }
}

class DiaryMutationBuilder extends MutationBuilder {
  constructor(knex) {
    super(knex, 'diary', 'diary entry');
  }
}

exports.DiaryQueryBuilder = DiaryQueryBuilder;
exports.DiaryMutationBuilder = DiaryMutationBuilder;