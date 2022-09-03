import * as faker from 'faker';
import { zDate, zNumber, zString } from 'zavid-modules';

import type { DiaryDAO, DiaryStatus } from './DiaryDAO';
import { DiaryStatic } from './DiaryStatic';

/** The class for Diary objects and methods. */
export class DiaryEntryBuilder {
  private entry: DiaryDAO = {};

  public withTitle(title?: string): DiaryEntryBuilder {
    this.entry.title = title!.trim();
    return this;
  }

  public withDate(date?: string | Date): DiaryEntryBuilder {
    this.entry.date = date!;
    return this;
  }

  public withStatus(status?: DiaryStatus): DiaryEntryBuilder {
    this.entry.status = status!;
    return this;
  }

  public withContent(content?: string): DiaryEntryBuilder {
    this.entry.content = content!.trim();
    return this;
  }

  public withFootnote(footnote?: string): DiaryEntryBuilder {
    this.entry.footnote = footnote!.trim();
    return this;
  }

  public withTags(tags?: string[]): DiaryEntryBuilder {
    this.entry.tags = tags!;
    return this;
  }

  public withEntryNumber(entryNumber?: number): DiaryEntryBuilder {
    this.entry.entryNumber = entryNumber;
    return this;
  }

  public setIsFavourite(isFavourite?: boolean): DiaryEntryBuilder {
    this.entry.isFavourite = new Boolean(isFavourite!).valueOf();
    return this;
  }

  public random(): DiaryEntryBuilder {
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

  public withRandomStatus(): DiaryEntryBuilder {
    this.entry.status = DiaryStatic.randomStatus();
    return this;
  }

  public withRandomContent(threshold = 5, limit = 10): DiaryEntryBuilder {
    this.entry.content = faker.lorem.paragraphs(
      zNumber.generateRandom(threshold, limit),
      '\n\n',
    );
    return this;
  }

  public withRandomDate(): DiaryEntryBuilder {
    this.entry.date = zDate.formatISODate(faker.date.past());
    return this;
  }

  public withRandomFootnote(): DiaryEntryBuilder {
    this.entry.footnote = faker.lorem.paragraphs(
      zNumber.generateRandom(1, 2),
      '\n\n',
    );
    return this;
  }

  public withRandomFavouriteFlag(): DiaryEntryBuilder {
    this.entry.isFavourite = Math.random() < 0.5;
    return this;
  }

  public withRandomTags(): DiaryEntryBuilder {
    this.entry.tags = DiaryStatic.generateRandomTags();
    return this;
  }

  /**
   * Builds the diary entry object.
   */
  public build(): DiaryDAO {
    return this.entry;
  }
}
