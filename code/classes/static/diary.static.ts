const { zDate } = require('zavid-modules');

import { getRandom } from '../helper';
import { DiaryDAO, DiaryStatus } from '../interfaces';

export class DiaryStatic {
  static STATUS = DiaryStatus;
  static STATUSES = Object.values(DiaryStatus);

  static generateSlug(diaryEntry: DiaryDAO): string{
    return zDate.formatISODate(diaryEntry.date);
  }

  static randomStatus(): DiaryStatus {
    return getRandom(this.STATUSES);
  }

  static isPrivate(input: DiaryDAO): boolean {
    return input.status === DiaryStatus.PRIVATE;
  }

  static isPublish(input: DiaryDAO): boolean {
    return input.status === DiaryStatus.PUBLISHED;
  }
}
