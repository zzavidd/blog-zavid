const { isFalsy } = require('zavid-modules').zLogic;

const { ORDER } = require('../../../constants/strings');

class QueryBuilder {
  constructor(knex, table, isMutation = false) {
    if (!isMutation) this.query = knex.select().from(table);
  }

  whereId(id) {
    if (isFalsy(id)) throw new Error(`No specified ID.`);
    this.query.where('id', id);
    return this;
  }

  /**
   * Enables sorting or randomising of the results.
   * @param {object} [sort] The sort details.
   * @param {string} [sort.field] The field to sort on.
   * @param {string} [sort.order] The sort order. Either 'ASC', 'DESC' or 'RANDOM'.
   * @param {object} [options] Any options.
   * @param {boolean} [options.forStringsWithNumbers] If sorting on fields with numbers.
   * @returns {PostQueryBuilder} The PostQueryBuilder object.
   */
  withOrder({ field, order } = {}, { forStringsWithNumbers = false } = {}) {
    if (isFalsy(order)) order = ORDER.ASCENDING;

    if (order === ORDER.RANDOM) {
      this.query.orderByRaw('RAND()');
    } else if (field) {
      console.log(forStringsWithNumbers);
      if (forStringsWithNumbers) {
        const cases = [
          `CAST((REGEXP_REPLACE(${field}, "[^0-9]+", '')) AS SIGNED) ${order}`,
          `REGEXP_REPLACE(${field}, "[^a-z0-9]+", '') ${order}`
        ];
        this.query.orderByRaw(cases.join(', '));
      } else {
        this.query.orderBy(field, order);
      }
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
   * @returns {string} The build Knex query.
   */
  build() {
    return this.query;
  }
}

class MutationBuilder extends QueryBuilder {
  constructor(knex, table, entity) {
    super(knex, table, true);
    this.query = knex(table);
    this.entity = entity;
  }

  insert(input) {
    if (isFalsy(input))
      throw new Error(`No specified ${this.entity} to insert.`);
    this.query.insert(input);
    return this;
  }

  update(input) {
    if (isFalsy(input))
      throw new Error(`No specified ${this.entity} to update.`);
    this.query.update(input);
    return this;
  }

  delete(id) {
    if (isFalsy(id)) throw new Error(`No specified ${this.entity} to delete.`);
    this.query.where('id', id).del();
    return this;
  }
}

exports.QueryBuilder = QueryBuilder;
exports.MutationBuilder = MutationBuilder;
