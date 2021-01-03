import faker from 'faker';
import { zDate, zNumber } from 'zavid-modules';

import { randomEnumValue } from '../helper';
import { DiaryDAO, DiaryStatus } from '../interfaces';

export class DiaryStatic {
  static STATUS = DiaryStatus;
  static STATUSES = Object.values(DiaryStatus);

  static generateSlug(diaryEntry: DiaryDAO): string {
    return zDate.formatISODate(diaryEntry.date as string);
  }

  static generateRandomTags(): string[] {
    const tags: string[] = [];
    for (let i = 0; i < zNumber.generateRandom(5, 10); i++) {
      const word = faker.random.word().toLowerCase().replace('-', '');
      if (!tags.includes(word)) tags.push(word);
    }
    return tags;
  }

  static randomStatus(): DiaryStatus {
    return randomEnumValue(DiaryStatus);
  }

  static parse(entry: DiaryDAO): DiaryDAO {
    if (!entry.tags) {
      entry.tags = [];
      return entry;
    }

    entry.tags = JSON.parse(entry.tags.toString());
    return entry;
  }

  static parseBatch(entries: DiaryDAO[]): DiaryDAO[] {
    return entries.map((entry: DiaryDAO) => this.parse(entry));
  }

  static isProtected(input: DiaryDAO): boolean {
    return input?.status === DiaryStatus.PROTECTED;
  }

  static isPrivate(input: DiaryDAO): boolean {
    return input?.status === DiaryStatus.PRIVATE;
  }

  static isPublish(input: DiaryDAO): boolean {
    return input?.status === DiaryStatus.PUBLISHED;
  }
}
