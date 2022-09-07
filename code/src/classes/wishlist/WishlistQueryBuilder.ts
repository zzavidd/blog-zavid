import type { Knex } from 'knex';

import { QueryBuilder, MutationBuilder } from 'classes/_/QueryBuilder';

import type WishlistDAO from './WishlistDAO';

/** Builds a post query with conditions. */
export class WishlistQueryBuilder extends QueryBuilder<WishlistDAO.Response> {
  constructor(knex: Knex) {
    super(knex, 'wishlist');
  }
}

export class WishlistMutationBuilder extends MutationBuilder<WishlistDAO.Request> {
  constructor(knex: Knex) {
    super(knex, 'wishlist', 'wishlist item');
  }
}
