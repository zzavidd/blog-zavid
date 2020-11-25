import Knex, { RawQueryBuilder } from 'knex';

import { QueryOrder } from '../../index';

export class QueryBuilder<T> {
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

  whereId(id: number): QueryBuilder<T> {
    if (!id) throw new Error(`No specified ID.`);
    this.query.where(`${this.table}.id`, id);
    return this;
  }

  exceptId(id: number): QueryBuilder<T> {
    if (!id) return this;
    this.query.whereNot(`${this.table}.id`, id);
    return this;
  }

  /**
   * Enables sorting or randomising of the results.
   */
  withOrder(
    sort: QuerySort = {},
    options: QuerySortOptions = {}
  ): QueryBuilder<T> {
    let { order } = sort;
    const { field } = sort;
    const { forStringsWithNumbers = false } = options;

    if (!order) order = QueryOrder.ASCENDING;

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
   */
  withLimit(limit: number): QueryBuilder<T> {
    if (limit) this.query.limit(limit);
    return this;
  }

  async build(): Promise<T[]> {
    return await this.query;
  }
}

export class MutationBuilder<T extends unknown> extends QueryBuilder<T> {
  entity: string;
  table: string;

  constructor(knex: Knex, table: string, entity: string) {
    super(knex, table, true);
    this.query = knex(table);
    this.entity = entity;
    this.table = table;
  }

  insert<E>(input: E): MutationBuilder<number> {
    if (!input) throw new Error(`No specified ${this.entity} to insert.`);
    this.query.insert(input);
    return <MutationBuilder<number>>this;
  }

  update<E>(input: E): MutationBuilder<T> {
    if (!input) throw new Error(`No specified ${this.entity} to update.`);
    this.query.update(input);
    return this;
  }

  delete(id: number): MutationBuilder<T> {
    if (!id) throw new Error(`No specified ${this.entity} to delete.`);
    this.query.where(`${this.table}.id`, id).del();
    return this;
  }

  truncate(): MutationBuilder<T> {
    this.query.truncate();
    return this;
  }
}

export interface QuerySort {
  field?: string;
  order?: string;
}

interface QuerySortOptions {
  forStringsWithNumbers?: boolean;
}