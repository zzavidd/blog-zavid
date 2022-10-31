import type { Knex } from 'knex';

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
    if (!id) throw new Error('No specified ID.');
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

export class MutationBuilder<
  Entity extends EntityDAO,
> extends QueryBuilder<Entity> {
  private entity: string;

  constructor(knex: Knex, table: string, entity: string) {
    super(knex, table, true);
    this.query = knex(table);
    this.entity = entity;
    this.table = table;
  }

  public insert(input: Entity): MutationBuilder<Entity> {
    if (!input) throw new Error(`No specified ${this.entity} to insert.`);
    serializeInput(input as Record<string, unknown>);
    void this.query.insert(input);
    return this;
  }

  public update(
    input: Entity,
    removeProperties: (keyof Entity)[] = [],
  ): MutationBuilder<Entity> {
    if (!input) throw new Error(`No specified ${this.entity} to update.`);
    serializeInput(input as Record<string, unknown>);
    removeProperties.forEach((property) => {
      delete input[property];
    });
    void this.query.update(input);
    return this;
  }

  public delete(id: number): MutationBuilder<Entity> {
    if (!id) throw new Error(`No specified ${this.entity} to delete.`);
    void this.query.where(`${this.table}.id`, id).del();
    return this;
  }

  public truncate(): MutationBuilder<Entity> {
    void this.query.truncate();
    return this;
  }
}

function serializeInput(input: Record<string, unknown>) {
  Object.entries(input).forEach(([prop, value]) => {
    if (value && typeof value === 'object' && !(value instanceof Date)) {
      input[prop] = JSON.stringify(value);
    }
  });
}

export interface QuerySort<T> {
  field?: keyof T;
  order?: string;
}

interface QuerySortOptions {
  forStringsWithNumbers?: boolean;
}
