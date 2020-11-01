import faker from 'faker';
import { zDate, zString } from 'zavid-modules';

import { DiaryStatic } from '../../static';
import { DiaryStatus, DiaryDAO } from '../../interfaces';

/** The class for Diary objects and methods. */
export class DiaryEntryBuilder {
  private entry: DiaryDAO = {};

  withDate(date: string): DiaryEntryBuilder {
    this.entry.date = date;
    return this;
  }

  withStatus(status: DiaryStatus): DiaryEntryBuilder {
    this.entry.status = status;
    return this;
  }

  withContent(content: string): DiaryEntryBuilder {
    this.entry.content = content;
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
   * @returns {object} The diary entry object.
   */
  build(): DiaryDAO {
    return this.entry;
  }
}
