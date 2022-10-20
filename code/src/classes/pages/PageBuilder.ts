import * as faker from 'faker';
import { zString } from 'zavid-modules';

import type { PageDAO } from './PageDAO';

/** The class for Page objects and methods. */
export class PageBuilder {
  private page: PageDAO = new PageBuilder().build();

  public withTitle(title?: string): PageBuilder {
    this.page.title = title!.trim();
    return this;
  }

  public withContent(content?: string): PageBuilder {
    this.page.content = content!.trim();
    return this;
  }

  public withExcerpt(excerpt?: string): PageBuilder {
    this.page.excerpt = excerpt!.trim();
    return this;
  }

  public withSlug(slug?: string): PageBuilder {
    this.page.slug = slug!.trim();
    return this;
  }

  public setIsEmbed(isEmbed?: boolean): PageBuilder {
    this.page.isEmbed = new Boolean(isEmbed!).valueOf();
    return this;
  }

  public random(): PageBuilder {
    const title = `Test: ${zString.toTitleCase(
      faker.company.catchPhraseNoun(),
    )}`;
    this.page = {
      title,
      content: faker.lorem.paragraphs().replace(/\n/g, '\n\n'),
      excerpt: faker.lorem.sentences(),
      isEmbed: true,
    };

    this.page.slug = zString.constructCleanSlug(title);

    return this;
  }

  public withRandomExcerpt(): PageBuilder {
    this.page.excerpt = faker.lorem.sentences(1);
    return this;
  }

  public build(): PageDAO {
    return this.page;
  }
}
