import { GenericDAO } from './super';

export interface DiaryDAO extends GenericDAO {
  title?: string;
  content?: string;
  footnote?: string;
  date?: string | Date;
  status?: DiaryStatus;
  entryNumber?: number;
  slug?: string;
  isFavourite?: boolean;
  tags?: string[] | string
}

export enum DiaryStatus {
  PROTECTED = 'PROTECTED',
  PRIVATE = 'PRIVATE',
  PUBLISHED = 'PUBLISHED'
}
