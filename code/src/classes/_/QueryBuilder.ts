import type { Knex } from 'knex';

import type { EntityDAO } from 'classes/entity';
import { QueryOrder } from 'constants/types';

export class QueryBuilder<T extends EntityDAO> {
  protected query: Knex | Knex.QueryBuilder;
  protected table: string;
  protected knex: Knex;

  constructor(knex: Knex<T>, table: string, isMutation = false) {
    if (!isMutation) {
      this.query = knex.select().from(table);
    } else {
      this.query = knex;
    }
    this.table = table;
    this.knex = knex;
  }

  public whereId(id: number): QueryBuilder<T> {
    if (!id) throw new Error(`No specified ID.`);
    void this.query.where(`${this.table}.id`, id);
    return this;
  }

  public exceptId(id: number): QueryBuilder<T> {
    if (!id) return this;
    void this.query.whereNot(`${this.table}.id`, id);
    return this;
  }

  /**
   * Enables sorting or randomising of the results.
   */
  public withOrder(
    sort: QuerySort<T> = {},
    options: QuerySortOptions = {},
  ): QueryBuilder<T> {
    let { order } = sort;
    const { field } = sort;
    const { forStringsWithNumbers = false } = options;

    if (!order) order = QueryOrder.ASCENDING;

    if (order === QueryOrder.RANDOM) {
      void (this.query.orderByRaw as Knex.RawQueryBuilder)('RAND()');
    } else if (field) {
      if (forStringsWithNumbers) {
        const cases = [
          `CAST((REGEXP_REPLACE(${
            this.table
          }.${field.toString()}, "[^0-9]+", '')) AS SIGNED) ${order}`,
          `REGEXP_REPLACE(${
            this.table
          }.${field.toString()}, "[^a-z0-9]+", '') ${order}`,
        ];
        this.query = (this.query.orderByRaw as Knex.RawQueryBuilder)(
          cases.join(', '),
        );
      } else {
        void this.query.orderBy(`${this.table}.${field.toString()}`, order);
      }
    }
    return this;
  }

  /**
   * Limits the number of results.
   */
  public withLimit(limit: number): QueryBuilder<T> {
    if (limit) void this.query.limit(limit);
    return this;
  }

  public async build(): Promise<T[]> {
    return await this.query;
  }
}

export class MutationBuilder<T> extends QueryBuilder<T> {
  private entity: string;

  constructor(knex: Knex, table: string, entity: string) {
    super(knex, table, true);
    this.query = knex(table);
    this.entity = entity;
    this.table = table;
  }

  public insert(input: T): MutationBuilder<T> {
    if (!input) throw new Error(`No specified ${this.entity} to insert.`);
    void this.query.insert(input);
    return this;
  }

  public update(input: T): MutationBuilder<T> {
    if (!input) throw new Error(`No specified ${this.entity} to update.`);
    void this.query.update(input);
    return this;
  }

  public delete(id: number): MutationBuilder<T> {
    if (!id) throw new Error(`No specified ${this.entity} to delete.`);
    void this.query.where(`${this.table}.id`, id).del();
    return this;
  }

  public truncate(): MutationBuilder<T> {
    void this.query.truncate();
    return this;
  }
}
export interface QuerySort<T extends EntityDAO> {
  field?: keyof T;
  order?: string;
}

interface QuerySortOptions {
  forStringsWithNumbers?: boolean;
}