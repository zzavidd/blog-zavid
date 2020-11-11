const { zLogic } = require('zavid-modules');
const { isFalsy } = zLogic;

import { QueryBuilder, MutationBuilder } from './super';

/** Builds a post query with conditions. */
export class PageQueryBuilder extends QueryBuilder {
  constructor(knex: any) {
    super(knex, 'pages');
  }

  whereSlug(slug: string): PageQueryBuilder {
    if (isFalsy(slug)) throw new Error(`No specified slug.`);
    this.query.where('slug', slug);
    return this;
  }

  whereIsEmbed(isEmbed: boolean): PageQueryBuilder{
    this.query.where('isEmbed', isEmbed);
    return this;
  }
}

export class PageMutationBuilder extends MutationBuilder {
  constructor(knex: any) {
    super(knex, 'pages', 'page');
  }
}