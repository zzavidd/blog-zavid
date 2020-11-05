const { zLogic } = require('zavid-modules');
import { QueryOrder } from '../../interfaces';
const { isFalsy } = zLogic;

export class QueryBuilder {

  knex: any
  query: any;
  table: string;

  constructor(knex: any, table: string, isMutation: boolean = false) {
    if (!isMutation) this.query = knex.select().from(table);
    this.table = table;
    this.knex = knex;
  }

  whereId(id: number): QueryBuilder {
    if (isFalsy(id)) throw new Error(`No specified ID.`);
    this.query.where(`${this.table}.id`, id);
    return this;
  }

  exceptId(id: number): QueryBuilder {
    if (isFalsy(id)) return this;
    this.query.whereNot(`${this.table}.id`, id);
    return this;
  }

  /**
   * Enables sorting or randomising of the results.
   * @param {object} [sort] The sort details.
   * @param {object} [options] Any options.
   * @param {boolean} [options.forStringsWithNumbers] If sorting on fields with numbers.
   * @returns {PostQueryBuilder} The PostQueryBuilder object.
   */
  withOrder(sort: QuerySort = {}, options: QuerySortOptions = {}) {
    let { field, order } = sort;
    let { forStringsWithNumbers = false } = options;
    if (isFalsy(order)) order = QueryOrder.ASCENDING;

    if (order === QueryOrder.RANDOM) {
      this.query.orderByRaw('RAND()');
    } else if (field) {
      if (forStringsWithNumbers) {
        const cases = [
          `CAST((REGEXP_REPLACE(${this.table}.${field}, "[^0-9]+", '')) AS SIGNED) ${order}`,
          `REGEXP_REPLACE(${this.table}.${field}, "[^a-z0-9]+", '') ${order}`
        ];
        this.query.orderByRaw(cases.join(', '));
      } else {
        this.query.orderBy(`${this.table}.${field}`, order);
      }
    }
    return this;
  }

  /**
   * Limits the number of results.
   * @param {number} [limit] - The number of results to be returned.
   * @returns {QueryBuilder} The PostQueryBuilder object.
   */
  withLimit(limit: number): QueryBuilder {
    if (isFalsy(limit)) return this;
    this.query.limit(limit);
    return this;
  }

  /**
   * Return the built query.
   * @returns {string} The build Knex query.
   */
  build(): any {
    return this.query;
  }
}

export class MutationBuilder extends QueryBuilder {
  entity: string;
  table: string;

  constructor(knex: any, table: string, entity: string) {
    super(knex, table, true);
    this.query = knex(table);
    this.entity = entity;
    this.table = table;
  }

  insert(input: any): MutationBuilder {
    if (isFalsy(input))
      throw new Error(`No specified ${this.entity} to insert.`);
    this.query.insert(input);
    return this;
  }

  update(input: any): MutationBuilder {
    if (isFalsy(input))
      throw new Error(`No specified ${this.entity} to update.`);
    this.query.update(input);
    return this;
  }

  delete(id: number): MutationBuilder {
    if (isFalsy(id)) throw new Error(`No specified ${this.entity} to delete.`);
    this.query.where(`${this.table}.id`, id).del();
    return this;
  }

  truncate(): MutationBuilder {
    this.query.truncate();
    return this;
  }
}

interface QuerySort {
  field?: string;
  order?: string;
}

interface QuerySortOptions {
  forStringsWithNumbers?: boolean;
}
