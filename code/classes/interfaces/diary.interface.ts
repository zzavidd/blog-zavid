export interface DiaryDAO {
  id?: number
  title?: string;
  content?: string;
  date?: string | Date
  status?: DiaryStatus
  entryNumber?: number
  slug?: string
}

export enum DiaryStatus {
  PRIVATE,
  PUBLISHED
}