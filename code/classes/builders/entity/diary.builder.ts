import * as faker from 'faker';
import { zDate, zString } from 'zavid-modules';

import { DiaryStatic, DiaryStatus, DiaryDAO } from '../../index';

/** The class for Diary objects and methods. */
export class DiaryEntryBuilder {
  private entry: DiaryDAO = {};

  withTitle(title?: string): DiaryEntryBuilder {
    this.entry.title = title!.trim();
    return this;
  }

  withDate(date?: string | Date): DiaryEntryBuilder {
    this.entry.date = date!;
    return this;
  }

  withStatus(status?: DiaryStatus): DiaryEntryBuilder {
    this.entry.status = status!;
    return this;
  }

  withContent(content?: string): DiaryEntryBuilder {
    this.entry.content = content!.trim();
    return this;
  }

  withEntryNumber(entryNumber?: number): DiaryEntryBuilder {
    entryNumber =
      typeof entryNumber && parseInt((entryNumber as unknown) as string);
    this.entry.entryNumber = entryNumber;
    return this;
  }

  random(): DiaryEntryBuilder {
    this.entry = {
      title: zString.toTitleCase(faker.company.catchPhraseNoun()),
      content: faker.lorem.paragraphs().replace(/\n/g, '\n\n'),
      date: zDate.formatISODate(faker.date.past()),
      status: DiaryStatic.randomStatus(),
      entryNumber: faker.random.number()
    };
    return this;
  }

  /**
   * Builds the diary entry object.
   */
  build(): DiaryDAO {
    return this.entry;
  }
}
