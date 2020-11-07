import { GenericDAO } from './super';

export interface DiaryDAO extends GenericDAO {
  title?: string;
  content?: string;
  date?: string | Date;
  status?: DiaryStatus;
  entryNumber?: number;
  slug?: string;
}

export enum DiaryStatus {
  PRIVATE = 'PRIVATE',
  PUBLISHED = 'PUBLISHED'
}
