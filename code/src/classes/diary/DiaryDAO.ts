import type { EntityDAO } from '../entity';

export interface DiaryDAO extends EntityDAO {
  title?: string;
  content?: string;
  footnote?: string;
  date?: string | Date;
  status?: DiaryStatus;
  entryNumber?: number;
  slug?: string;
  isFavourite?: boolean;
  tags?: string[] | string;
}

export enum DiaryStatus {
  PROTECTED = 'PROTECTED',
  PRIVATE = 'PRIVATE',
  PUBLISHED = 'PUBLISHED',
}
