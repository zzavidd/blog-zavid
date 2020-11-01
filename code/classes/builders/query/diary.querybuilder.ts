import { DiaryStatus, QueryOrder } from '../../interfaces';
import { zLogic } from 'zavid-modules';
import { MutationBuilder, QueryBuilder } from './super';

const { isFalsy } = zLogic;

const TABLE_NAME = 'diary';

/** Builds a post query with conditions. */
export class DiaryQueryBuilder extends QueryBuilder {
  constructor(knex: any) {
    super(knex, TABLE_NAME);
    this.knex = knex;
  }

  whereSlug(slug: string): DiaryQueryBuilder {
    if (isFalsy(slug)) throw new Error(`No slug specified.`);
    this.query.where('slug', slug);
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

  getPreviousEntry(slug: string): DiaryQueryBuilder {
    if (isFalsy(slug)) throw new Error(`No slug specified.`);
    this.query.where({
      slug: this.knex(TABLE_NAME).max('slug').where('slug', '<', slug),
      status: DiaryStatus.PUBLISHED
    });
    return this;
  }

  getNextEntry(slug: string): DiaryQueryBuilder {
    if (isFalsy(slug)) throw new Error(`No slug specified.`);
    this.query.where({
      slug: this.knex(TABLE_NAME).min('slug').where('slug', '>', slug),
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
  constructor(knex: any) {
    super(knex, TABLE_NAME, 'diary entry');
  }
}

interface DiaryStatusFilters {
  include?: DiaryStatus[];
  exclude?: DiaryStatus[];
}