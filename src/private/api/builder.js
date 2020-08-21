const Knex = require('knex');

/** Builds a Knex query with conditions. */
class QueryBuilder {
  /**
   * Query constructor.
   * @param {Knex} query - The base Knex query.
   */
  constructor(query) {
    this.query = query;
  }

  /**
   * Checks for identifier.
   * @param {number} id - The ID required.
   * @returns {QueryBuilder} The QueryBuilder object.
   */
  withId(id) {
    this.query.where('id', id);
    return this;
  }

  /**
   * Applies a WHERE condition using a field and value.
   * @param {string} [field] - The conditional field.
   * @param {any} [value] - The expected value.
   * @returns {QueryBuilder} The QueryBuilder object.
   */
  withCondition(field, value) {
    if (isNull(field)) return this;

    if (field && value) this.query.where(field, value);
    return this;
  }

  /**
   * Enables sorting or randomising of the results.
   * @param {object} [sort] - The sort details.
   * @param {string} [sort.field] - The field to sort on.
   * @param {string} [sort.order] - The sort order. Either 'ASC', 'DESC' or 'RANDOM'.
   * @returns {QueryBuilder} The QueryBuilder object.
   */
  withOrder({ field, order } = {}) {
    if (isNull(field)) return this;
    if (isNull(order)) order = 'ASC';

    const cases = [
      `CAST((REGEXP_REPLACE(${field}, "[^0-9]+", '')) AS SIGNED) ${order}`,
      `REGEXP_REPLACE(${field}, "[^a-z0-9]+", '') ${order}`
    ];

    if (order === 'RANDOM') {
      this.query.orderByRaw('RAND()');
    } else if (field) {
      this.query.orderByRaw(cases.join(', '));
    }
    return this;
  }

  /**
   * Limits the number of results.
   * @param {number} [limit] - The number of results to be returned.
   * @returns {QueryBuilder} The QueryBuilder object.
   */
  withLimit(limit) {
    if (isNull(limit)) return this;
    if (limit) this.query.limit(limit);
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

const isNull = (...values) => {
  return values.some((value) => value === null);
};

exports.QueryBuilder = QueryBuilder;
