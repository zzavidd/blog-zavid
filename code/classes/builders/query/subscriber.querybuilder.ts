import Knex from 'knex';

import { QueryBuilder, MutationBuilder } from './super';

/** Builds a post query with conditions. */
export class SubscriberQueryBuilder extends QueryBuilder {
  constructor(knex: Knex) {
    super(knex, 'subscribers');
  }

  whereToken(token: string) {
    this.query.where('token', token);
    return this;
  }
}

export class SubscriberMutationBuilder extends MutationBuilder {
  constructor(knex: Knex) {
    super(knex, 'subscribers', 'subscriber');
  }
}