const { zLogic } = require('zavid-modules');
const { isFalsy } = zLogic;

/** Builds a post query with conditions. */
class PostQueryBuilder {
  constructor(knex) {
    this.query = knex.select().from('posts');
  }

  whereId(id) {
    if (isFalsy(id)) return this;
    this.query.where('id', id);
    return this;
  }

  whereType(type) {
    if (isFalsy(type)) return this;
    this.query.where('type', type);
    return this;
  }

  whereDomainType(type) {
    if (isFalsy(type)) return this;
    this.query.where('domainType', type);
    return this;
  }

  whereSlug(slug) {
    if (isFalsy(slug)) return this;
    this.query.where('slug', slug);
    return this;
  }

  /**
   * Enables sorting or randomising of the results.
   * @param {object} [sort] The sort details.
   * @param {string} [sort.field] The field to sort on.
   * @param {string} [sort.order] The sort order. Either 'ASC', 'DESC' or 'RANDOM'.
   * @returns {PostQueryBuilder} The PostQueryBuilder object.
   */
  withOrder({ field, order } = {}) {
    if (isFalsy(field)) return this;
    if (isFalsy(order)) order = 'ASC';

    if (order === 'RANDOM') {
      this.query.orderByRaw('RAND()');
    } else if (field) {
      const cases = [
        `CAST((REGEXP_REPLACE(${field}, "[^0-9]+", '')) AS SIGNED) ${order}`,
        `REGEXP_REPLACE(${field}, "[^a-z0-9]+", '') ${order}`
      ];
      this.query.orderByRaw(cases.join(', '));
    }
    return this;
  }

  /**
   * Limits the number of results.
   * @param {number} [limit] - The number of results to be returned.
   * @returns {PostQueryBuilder} The PostQueryBuilder object.
   */
  withLimit(limit) {
    if (isFalsy(limit)) return this;
    this.query.limit(limit);
    return this;
  }

  /**
   * Return the built query.
   * @returns {Knex} The build Knex query.
   */
  build() {
    return this.query;
  }
}

class PostMutationBuilder {
  constructor(knex, table) {
    this.query = knex(table);
  }
}

exports.PostQueryBuilder = PostQueryBuilder;
exports.PostMutationBuilder = PostMutationBuilder;
