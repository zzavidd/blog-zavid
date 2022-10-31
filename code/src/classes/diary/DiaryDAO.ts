export interface DiaryDAO {
  id?: number;
  title: string;
  content: string;
  footnote: string;
  date: string | Date;
  status: DiaryStatus;
  entryNumber: number;
  isFavourite: boolean;
  tags: string | string[];
  slug?: string;
}

export enum DiaryStatus {
  PROTECTED = 'PROTECTED',
  PRIVATE = 'PRIVATE',
  PUBLISHED = 'PUBLISHED',
}
