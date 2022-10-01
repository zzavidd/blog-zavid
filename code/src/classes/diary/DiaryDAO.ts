import type { EntityDAO } from '../entity';

export interface DiaryDAO extends EntityDAO {
  title: string;
  content: string;
  footnote: string;
  date: string | Date;
  status: DiaryStatus;
  entryNumber: number;
  isFavourite: boolean;
  tags: string[] | string;
  slug?: string;
}

export enum DiaryStatus {
  PROTECTED = 'PROTECTED',
  PRIVATE = 'PRIVATE',
  PUBLISHED = 'PUBLISHED',
}
