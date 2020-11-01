export interface DiaryDAO {
  title?: string;
  content?: string;
  date?: string | Date
  status?: DiaryStatus
  entryNumber?: number
}

export enum DiaryStatus {
  PRIVATE,
  PUBLISHED
}