import Knex from 'knex';
import { zLogic } from 'zavid-modules';

import { DiaryStatus, QueryOrder } from 'classes';

import { MutationBuilder, QueryBuilder } from './super';

const { isFalsy } = zLogic;

const TABLE_NAME = 'diary';

/** Builds a post query with conditions. */
export class DiaryQueryBuilder extends QueryBuilder {
  constructor(knex: Knex) {
    super(knex, TABLE_NAME);
    this.knex = knex;
  }

  whereSlug(slug: string | number): DiaryQueryBuilder {
    if (isFalsy(slug)) throw new Error(`No slug specified.`);
    this.query.where('slug', slug);
    return this;
  }

  whereEntryNumber(entryNumber: number): DiaryQueryBuilder {
    if (isFalsy(entryNumber)) throw new Error(`No entry number specified.`);
    this.query.where('entryNumber', entryNumber);
    return this;
  }

  whereStatus(filters: DiaryStatusFilters = {}): DiaryQueryBuilder {
    const { include, exclude } = filters;
    if (!isFalsy(include)) this.query.whereIn('status', include);
    if (!isFalsy(exclude)) this.query.whereNotIn('status', exclude);
    return this;
  }

  getLatestEntry(): DiaryQueryBuilder {
    this.query.orderBy('date', QueryOrder.DESCENDING).limit(1);
    return this;
  }

  getLatestEntryNumber(): DiaryQueryBuilder {
    this.query.max('entryNumber', { as: 'latestEntryNumber' });
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

  /**
   * Limits the number of results.
   * @param {number} [limit] - The number of results to be returned.
   * @returns {PostQueryBuilder} The PostQueryBuilder object.
   */
  withLimit(limit: number): DiaryQueryBuilder {
    if (isFalsy(limit)) return this;
    this.query.limit(limit);
    return this;
  }
}

export class DiaryMutationBuilder extends MutationBuilder {
  constructor(knex: Knex) {
    super(knex, TABLE_NAME, 'diary entry');
  }
}

interface DiaryStatusFilters {
  include?: DiaryStatus[];
  exclude?: DiaryStatus[];
}
