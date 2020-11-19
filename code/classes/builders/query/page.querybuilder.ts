import Knex from 'knex';

import { QueryBuilder, MutationBuilder } from './super';

import { PageDAO } from '../../interfaces';

/** Builds a post query with conditions. */
export class PageQueryBuilder extends QueryBuilder<PageDAO> {
  constructor(knex: Knex) {
    super(knex, 'pages');
  }

  whereSlug(slug: string): PageQueryBuilder {
    if (!slug) throw new Error(`No specified slug.`);
    this.query.where('slug', slug);
    return this;
  }

  whereIsEmbed(isEmbed: boolean): PageQueryBuilder{
    this.query.where('isEmbed', isEmbed);
    return this;
  }
}

export class PageMutationBuilder extends MutationBuilder<PageDAO> {
  constructor(knex: Knex) {
    super(knex, 'pages', 'page');
  }
}