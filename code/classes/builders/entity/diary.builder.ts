import * as faker from 'faker';
import { zDate, zNumber, zString } from 'zavid-modules';

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
      .withRandomContent()
      .withRandomFootnote()
      .withRandomDate()
      .withRandomStatus()
      .withEntryNumber(faker.random.number())
      .withRandomFavouriteFlag()
      .withRandomTags()
      .build();

    return this;
  }

  withRandomStatus(): DiaryEntryBuilder {
    this.entry.status = DiaryStatic.randomStatus();
    return this;
  }

  withRandomContent(threshold = 5, limit = 10): DiaryEntryBuilder {
    this.entry.content = faker.lorem.paragraphs(
      zNumber.generateRandom(threshold, limit),
      '\n\n',
    );
    return this;
  }

  withRandomDate(): DiaryEntryBuilder {
    this.entry.date = zDate.formatISODate(faker.date.past());
    return this;
  }

  withRandomFootnote(): DiaryEntryBuilder {
    this.entry.footnote = faker.lorem.paragraphs(
      zNumber.generateRandom(1, 2),
      '\n\n',
    );
    return this;
  }

  withRandomFavouriteFlag(): DiaryEntryBuilder {
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
