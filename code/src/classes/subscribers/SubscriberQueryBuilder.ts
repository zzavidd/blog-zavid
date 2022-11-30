import type { Knex } from 'knex';

import { QueryBuilder, MutationBuilder } from 'classes/_/QueryBuilder';

/** Builds a post query with conditions. */
export class SubscriberQueryBuilder extends QueryBuilder<SubscriberDAO> {
  constructor(knex: Knex) {
    super(knex, 'subscribers');
  }

  public whereToken(token: string): SubscriberQueryBuilder {
    void this.query.where('token', token);
    return this;
  }
}

export class SubscriberMutationBuilder extends MutationBuilder<SubscriberDAO> {
  constructor(knex: Knex) {
    super(knex, 'subscribers', 'subscriber');
  }
}
