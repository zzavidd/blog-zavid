import * as faker from 'faker';
import { zDate, zString } from 'zavid-modules';

import { DiaryDAO, DiaryStatic, DiaryStatus } from '../../index';

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

  withFootnote(footnote?: string): DiaryEntryBuilder {
    this.entry.footnote = footnote!.trim();
    return this;
  }

  withTags(tags?: string[]): DiaryEntryBuilder {
    this.entry.tags = tags!;
    return this;
  }

  withEntryNumber(entryNumber?: number): DiaryEntryBuilder {
    this.entry.entryNumber = entryNumber;
    return this;
  }

  setIsFavourite(isFavourite?: boolean): DiaryEntryBuilder {
    this.entry.isFavourite = new Boolean(isFavourite!).valueOf();
    return this;
  }

  random(): DiaryEntryBuilder {
    const title = zString.toTitleCase(faker.company.catchPhraseNoun());

    this.entry = this.withTitle(title)
      .withContent(faker.lorem.paragraphs().replace(/\n/g, '\n\n'))
      .withFootnote(faker.lorem.paragraphs(1))
      .withDate(zDate.formatISODate(faker.date.past()))
      .withStatus(DiaryStatic.randomStatus())
      .withEntryNumber(faker.random.number())
      .withRandomFavFlag()
      .withRandomTags()
      .build();
      
    return this;
  }

  withRandomFavFlag(): DiaryEntryBuilder {
    this.entry.isFavourite = Math.random() < 0.5;
    return this;
  }

  withRandomTags(): DiaryEntryBuilder {
    this.entry.tags = DiaryStatic.generateRandomTags();
    return this;
  }

  /**
   * Builds the diary entry object.
   */
  build(): DiaryDAO {
    return this.entry;
  }
}
