import faker from 'faker';
import { zDate, zNumber } from 'zavid-modules';

import { randomEnumValue } from '../helper';
import type { DiaryDAO } from '../interfaces';
import { DiaryStatus } from '../interfaces';

export class DiaryStatic {
  public static STATUS = DiaryStatus;
  public static STATUSES = Object.values(DiaryStatus);

  public static generateSlug(diaryEntry: DiaryDAO): string {
    return zDate.formatISODate(diaryEntry.date as string);
  }

  public static generateRandomTags(): string[] {
    const tags: string[] = [];
    for (let i = 0; i < zNumber.generateRandom(5, 10); i++) {
      const word = faker.random.word().toLowerCase().replace('-', '');
      if (!tags.includes(word)) tags.push(word);
    }
    return tags;
  }

  public static randomStatus(): DiaryStatus {
    return randomEnumValue(DiaryStatus);
  }

  public static parse(entry: DiaryDAO): DiaryDAO {
    if (!entry.tags) {
      entry.tags = [];
      return entry;
    }

    entry.tags = JSON.parse(entry.tags.toString());
    return entry;
  }

  public static parseBatch(entries: DiaryDAO[]): DiaryDAO[] {
    return entries.map((entry: DiaryDAO) => this.parse(entry));
  }

  public static isProtected(input: DiaryDAO): boolean {
    return input?.status === DiaryStatus.PROTECTED;
  }

  public static isPrivate(input: DiaryDAO): boolean {
    return input?.status === DiaryStatus.PRIVATE;
  }

  public static isPublish(input: DiaryDAO): boolean {
    return input?.status === DiaryStatus.PUBLISHED;
  }
}
