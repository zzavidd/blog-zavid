import Knex from 'knex';

import { QueryBuilder, MutationBuilder } from './super';

import { SubscriberDAO } from '../../interfaces';

/** Builds a post query with conditions. */
export class SubscriberQueryBuilder extends QueryBuilder<SubscriberDAO> {
  constructor(knex: Knex) {
    super(knex, 'subscribers');
  }

  whereToken(token: string) {
    this.query.where('token', token);
    return this;
  }
}

export class SubscriberMutationBuilder extends MutationBuilder<SubscriberDAO> {
  constructor(knex: Knex) {
    super(knex, 'subscribers', 'subscriber');
  }
}
