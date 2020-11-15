import Knex, { RawQueryBuilder } from 'knex';
import { zLogic } from 'zavid-modules';

import { QueryOrder } from 'classes';
const { isFalsy } = zLogic;

export class QueryBuilder {
  knex: Knex;
  query: Knex | Knex.QueryBuilder;
  table: string;

  constructor(knex: Knex, table: string, isMutation = false) {
    if (!isMutation) {
      this.query = knex.select().from(table);
    } else {
      this.query = knex;
    }
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
    let { order } = sort;
    const { field } = sort;
    const { forStringsWithNumbers = false } = options;
    if (isFalsy(order)) order = QueryOrder.ASCENDING;

    if (order === QueryOrder.RANDOM) {
      (this.query.orderByRaw as RawQueryBuilder)('RAND()');
    } else if (field) {
      if (forStringsWithNumbers) {
        const cases = [
          `CAST((REGEXP_REPLACE(${this.table}.${field}, "[^0-9]+", '')) AS SIGNED) ${order}`,
          `REGEXP_REPLACE(${this.table}.${field}, "[^a-z0-9]+", '') ${order}`
        ];
        (this.query.orderByRaw as RawQueryBuilder)(cases.join(', '));
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

  build(): unknown {
    return this.query;
  }
}

export class MutationBuilder extends QueryBuilder {
  entity: string;
  table: string;

  constructor(knex: Knex, table: string, entity: string) {
    super(knex, table, true);
    this.query = knex(table);
    this.entity = entity;
    this.table = table;
  }

  insert<T>(input: T): MutationBuilder {
    if (isFalsy(input))
      throw new Error(`No specified ${this.entity} to insert.`);
    this.query.insert(input);
    return this;
  }

  update<T>(input: T): MutationBuilder {
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
