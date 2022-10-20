import faker from 'faker';

import ZDate from 'lib/date';
import ZNumber from 'lib/number';

import { randomEnumValue } from '../helper';

import type { DiaryDAO } from './DiaryDAO';
import { DiaryStatus } from './DiaryDAO';

export class DiaryStatic {
  public static STATUS = DiaryStatus;
  public static STATUSES = Object.values(DiaryStatus);

  /**
   * Gets the title for diary entry.
   * @param diaryEntry The entry.
   * @returns The title.
   */
  public static getTitle(diaryEntry: DiaryDAO) {
    return `Diary Entry #${diaryEntry.entryNumber}: ${diaryEntry.title}`;
  }

  /**
   * Gets the URL for diary entry.
   * @param diaryEntry The entry.
   * @returns The URL.
   */
  public static getUrl(diaryEntry: DiaryDAO) {
    return `/diary/${diaryEntry.entryNumber}`;
  }

  public static generateSlug(diaryEntry: DiaryDAO): string {
    return ZDate.formatISO(diaryEntry.date);
  }

  public static generateRandomTags(): string[] {
    const tags: string[] = [];
    for (let i = 0; i < ZNumber.generateRandom(5, 10); i++) {
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

    entry.tags = JSON.parse(String(entry.tags));
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

  public static isPublished(input: DiaryDAO): boolean {
    return input?.status === DiaryStatus.PUBLISHED;
  }
}
