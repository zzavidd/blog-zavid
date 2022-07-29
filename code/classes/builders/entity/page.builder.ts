import * as faker from 'faker';
import { zString } from 'zavid-modules';

import { PageDAO } from '../../index';

/** The class for Page objects and methods. */
export class PageBuilder {
  private page: PageDAO = {};

  withTitle(title?: string): PageBuilder {
    this.page.title = title!.trim();
    return this;
  }

  withContent(content?: string): PageBuilder {
    this.page.content = content!.trim();
    return this;
  }

  withExcerpt(excerpt?: string): PageBuilder {
    this.page.excerpt = excerpt!.trim();
    return this;
  }

  withSlug(slug?: string): PageBuilder {
    this.page.slug = slug!.trim();
    return this;
  }

  setIsEmbed(isEmbed?: boolean): PageBuilder {
    this.page.isEmbed = new Boolean(isEmbed!).valueOf();
    return this;
  }

  random(): PageBuilder {
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

  withRandomExcerpt(): PageBuilder {
    this.page.excerpt = faker.lorem.sentences(1);
    return this;
  }

  build(): PageDAO {
    return this.page;
  }
}
