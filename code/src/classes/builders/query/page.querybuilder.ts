import type { Knex } from 'knex';

import type { PageDAO } from 'classes';

import { QueryBuilder, MutationBuilder } from './super';

/** Builds a post query with conditions. */
export class PageQueryBuilder extends QueryBuilder<PageDAO> {
  constructor(knex: Knex) {
    super(knex, 'pages');
  }

  public whereSlug(slug: string): PageQueryBuilder {
    if (!slug) throw new Error(`No specified slug.`);
    void this.query.where('slug', slug);
    return this;
  }

  public whereIsEmbed(isEmbed: boolean): PageQueryBuilder {
    void this.query.where('isEmbed', isEmbed);
    return this;
  }
}

export class PageMutationBuilder extends MutationBuilder<PageDAO> {
  constructor(knex: Knex) {
    super(knex, 'pages', 'page');
  }
}