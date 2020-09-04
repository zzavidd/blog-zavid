const { zLogic } = require('zavid-modules');
const { isFalsy } = zLogic;

class QueryBuilder {
  whereId(id) {
    if (isFalsy(id)) return this;
    this.query.where('id', id);
    return this;
  }

  /**
   * Return the built query.
   * @returns {string} The build Knex query.
   */
  build() {
    return this.query;
  }
}

/** Builds a post query with conditions. */
class PostQueryBuilder extends QueryBuilder {
  constructor(knex) {
    super();
    this.query = knex.select().from('posts');
  }

  whereType({ include, exclude } = {}) {
    if (!isFalsy(include)) this.query.whereIn('type', include);
    if (!isFalsy(exclude)) this.query.whereNotIn('type', exclude);
    return this;
  }

  whereStatus({ include, exclude } = {}) {
    if (!isFalsy(include)) this.query.whereIn('status', include);
    if (!isFalsy(exclude)) this.query.whereNotIn('status', exclude);
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
}

class PostMutationBuilder extends QueryBuilder {
  constructor(knex, table) {
    super();
    this.query = knex(table);
  }

  insert(post) {
    if (isFalsy(post)) throw new Error('No specified post to insert.');
    this.query.insert(post);
    return this;
  }

  update(post) {
    if (isFalsy(post)) throw new Error('No specified post to update.');
    this.query.update(post);
    return this;
  }

  delete(id) {
    if (isFalsy(id)) throw new Error('No specified post to delete.');
    this.query.where('id', id).del();
    return this;
  }
}

exports.PostQueryBuilder = PostQueryBuilder;
exports.PostMutationBuilder = PostMutationBuilder;
