import { faker } from '@faker-js/faker/locale/en_GB';

import { IDiaryStatus } from 'constants/enums';
import ZDate from 'lib/date';
import ZNumber from 'lib/number';

import { randomEnumValue } from '../helper';

export class DiaryStatic {
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

  public static randomStatus(): IDiaryStatus {
    return randomEnumValue(IDiaryStatus);
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
    return input?.status === IDiaryStatus.PROTECTED;
  }

  public static isPrivate(input: DiaryDAO): boolean {
    return input?.status === IDiaryStatus.PRIVATE;
  }

  public static isPublished(input: DiaryDAO): boolean {
    return input?.status === IDiaryStatus.PUBLISHED;
  }
}
