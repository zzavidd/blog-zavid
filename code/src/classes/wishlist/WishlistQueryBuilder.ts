import type { Knex } from 'knex';

import { QueryBuilder, MutationBuilder } from 'classes/_/QueryBuilder';

/** Builds a post query with conditions. */
export class WishlistQueryBuilder extends QueryBuilder<WishlistDAO> {
  constructor(knex: Knex) {
    super(knex, 'wishlist');
  }
}

export class WishlistMutationBuilder extends MutationBuilder<WishlistDAO> {
  constructor(knex: Knex) {
    super(knex, 'wishlist', 'wishlist item');
  }
}
