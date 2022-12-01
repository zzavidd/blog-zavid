import type { Knex } from 'knex';

import { QueryBuilder, MutationBuilder } from 'classes/_/QueryBuilder';
import { IDiaryStatus, QueryOrder } from 'constants/enums';

const TABLE_NAME = 'diary';

/** Builds a post query with conditions. */
export class DiaryQueryBuilder extends QueryBuilder<DiaryDAO> {
  private static FIELD = 'entryNumber';

  constructor(knex: Knex) {
    super(knex, TABLE_NAME);
    this.knex = knex;
  }

  public whereSlug(slug: string | number): DiaryQueryBuilder {
    void this.query.where('slug', slug);
    return this;
  }

  public whereEntryNumber(entryNumber: number): DiaryQueryBuilder {
    void this.query.where('entryNumber', entryNumber);
    return this;
  }

  public whereStatus(filters: DiaryStatusFilters = {}): DiaryQueryBuilder {
    const { include, exclude } = filters;
    if (include && include.length) void this.query.whereIn('status', include);
    if (exclude && exclude.length)
      void this.query.whereNotIn('status', exclude);
    return this;
  }

  public whereIsFavourite(isFavourite: boolean): DiaryQueryBuilder {
    if (isFavourite) void this.query.where('isFavourite', isFavourite);
    return this;
  }

  public getLatestEntry(): DiaryQueryBuilder {
    void this.query.orderBy('date', QueryOrder.DESCENDING).limit(1);
    return this;
  }

  public getLatestEntryNumber(): DiaryQueryBuilder {
    void (this.query.max as Knex.TypePreservingAggregation)('entryNumber', {
      as: 'latestEntryNumber',
    });
    return this;
  }

  public getPreviousEntry(operand: string | number): DiaryQueryBuilder {
    void this.query.where({
      [DiaryQueryBuilder.FIELD]: this.knex(TABLE_NAME)
        .max(DiaryQueryBuilder.FIELD)
        .where(DiaryQueryBuilder.FIELD, '<', operand),
      status: IDiaryStatus.PUBLISHED,
    });
    return this;
  }

  public getNextEntry(operand: string | number): DiaryQueryBuilder {
    void this.query.where({
      [DiaryQueryBuilder.FIELD]: this.knex(TABLE_NAME)
        .min(DiaryQueryBuilder.FIELD)
        .where(DiaryQueryBuilder.FIELD, '>', operand),
      status: IDiaryStatus.PUBLISHED,
    });
    return this;
  }
}

export class DiaryMutationBuilder extends MutationBuilder<DiaryDAO> {
  constructor(knex: Knex) {
    super(knex, TABLE_NAME, 'diary entry');
  }
}
