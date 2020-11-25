import Knex, { TypePreservingAggregation } from 'knex';

import { MutationBuilder, QueryBuilder } from './super';

import { DiaryDAO, DiaryStatus, QueryOrder } from '../../index';

const TABLE_NAME = 'diary';

/** Builds a post query with conditions. */
export class DiaryQueryBuilder extends QueryBuilder<DiaryDAO> {
  constructor(knex: Knex) {
    super(knex, TABLE_NAME);
    this.knex = knex;
  }

  whereSlug(slug: string | number): DiaryQueryBuilder {
    this.query.where('slug', slug);
    return this;
  }

  whereEntryNumber(entryNumber: number): DiaryQueryBuilder {
    this.query.where('entryNumber', entryNumber);
    return this;
  }

  whereStatus(filters: DiaryStatusFilters = {}): DiaryQueryBuilder {
    const { include, exclude } = filters;
    if (include && include.length) this.query.whereIn('status', include);
    if (exclude && exclude.length) this.query.whereNotIn('status', exclude);
    return this;
  }

  getLatestEntry(): DiaryQueryBuilder {
    this.query.orderBy('date', QueryOrder.DESCENDING).limit(1);
    return this;
  }

  getLatestEntryNumber(): DiaryQueryBuilder {
    (this.query.max as KnexMaxQuery)('entryNumber', {
      as: 'latestEntryNumber'
    });
    return this;
  }

  getPreviousEntry(operand: string | number, field: string): DiaryQueryBuilder {
    this.query.where({
      [field]: this.knex(TABLE_NAME).max(field).where(field, '<', operand),
      status: DiaryStatus.PUBLISHED
    });
    return this;
  }

  getNextEntry(operand: string | number, field: string): DiaryQueryBuilder {
    this.query.where({
      [field]: this.knex(TABLE_NAME).min(field).where(field, '>', operand),
      status: DiaryStatus.PUBLISHED
    });
    return this;
  }
}

export class DiaryMutationBuilder extends MutationBuilder<DiaryDAO> {
  constructor(knex: Knex) {
    super(knex, TABLE_NAME, 'diary entry');
  }
}

export interface DiaryStatusFilters {
  include?: DiaryStatus[];
  exclude?: DiaryStatus[];
}

type KnexMaxQuery = TypePreservingAggregation<unknown, unknown, unknown>;
