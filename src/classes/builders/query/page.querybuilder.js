const { isFalsy } = require('zavid-modules').zLogic;

const { QueryBuilder, MutationBuilder } = require('./super');

/** Builds a post query with conditions. */
class PageQueryBuilder extends QueryBuilder {
  constructor(knex) {
    super(knex, 'pages');
  }

  whereSlug(slug) {
    if (isFalsy(slug)) throw new Error(`No specified slug.`);
    this.query.where('slug', slug);
    return this;
  }

  whereIsEmbed(isEmbed){
    this.query.where('isEmbed', isEmbed);
    return this;
  }
}

class PageMutationBuilder extends MutationBuilder {
  constructor(knex) {
    super(knex, 'pages', 'page');
  }
}

exports.PageQueryBuilder = PageQueryBuilder;
exports.PageMutationBuilder = PageMutationBuilder;
