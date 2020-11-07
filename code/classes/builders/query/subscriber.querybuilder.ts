import { QueryBuilder, MutationBuilder } from './super';

/** Builds a post query with conditions. */
export class SubscriberQueryBuilder extends QueryBuilder {
  constructor(knex: any) {
    super(knex, 'subscribers');
  }

  whereToken(token: string) {
    this.query.where('token', token);
    return this;
  }
}

export class SubscriberMutationBuilder extends MutationBuilder {
  constructor(knex: any) {
    super(knex, 'subscribers', 'subscriber');
  }
}