const { QueryBuilder, MutationBuilder } = require('./super');

/** Builds a post query with conditions. */
class SubscriberQueryBuilder extends QueryBuilder {
  constructor(knex) {
    super(knex, 'subscribers');
  }
}

class SubscriberMutationBuilder extends MutationBuilder {
  constructor(knex) {
    super(knex, 'subscribers', 'subscriber');
  }
}

exports.SubscriberQueryBuilder = SubscriberQueryBuilder;
exports.SubscriberMutationBuilder = SubscriberMutationBuilder;
