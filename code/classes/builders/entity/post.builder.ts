import * as faker from 'faker';
const { zDate, zString } = require('zavid-modules');

import { PostStatic } from '../../static';
import {
  PostDAO,
  RandomPostOptions,
  PostType,
  PostStatus
} from '../../interfaces';

/** The class for Post objects and methods. */
export class PostBuilder {
  private post: PostDAO = {};

  withTitle(title: string): PostBuilder {
    this.post.title = title;
    return this;
  }

  withType(type: PostType): PostBuilder {
    this.post.type = type;
    return this;
  }

  withTypeId(typeId: number): PostBuilder {
    this.post.typeId = typeId;
    return this;
  }

  withContent(content: string): PostBuilder {
    this.post.content = content;
    return this;
  }

  withStatus(status: PostStatus): PostBuilder {
    this.post.status = status;
    return this;
  }

  withDatePublished(date: string | Date): PostBuilder {
    this.post.datePublished = date;
    return this;
  }

  withDomain(id: number): PostBuilder {
    this.post.domainId = id;
    return this;
  }

  random(options: RandomPostOptions = {}): PostBuilder {
    const {
      allowPageTypes = true,
      withImage = false,
      numberOfContentImages = 0
    } = options;
    
    this.post = {
      title: `Test: ${zString.toTitleCase(faker.company.catchPhrase())}`,
      type: PostStatic.randomType({ allowPageTypes }),
      content: faker.lorem.paragraphs().replace(/\n/g, '\n\n'),
      excerpt: faker.lorem.sentences(),
      status: PostStatic.randomStatus(),
      datePublished: zDate.formatISODate(faker.date.past()),
      image: {
        source: withImage ? faker.image.image() : '',
        hasChanged: withImage
      },
      contentImages: new Array(numberOfContentImages).fill({
        source: faker.image.image(),
        hasChanged: true
      })
    };

    if (this.post.type !== PostType.PAGE) {
      this.post.typeId = faker.random.number();
    }

    return this;
  }

  withRandomExcerpt(): PostBuilder {
    this.post.excerpt = faker.lorem.sentences(1);
    return this;
  }

  withRandomImage(): PostBuilder {
    this.post.image = {
      source: faker.image.image(),
      hasChanged: true
    };
    return this;
  }

  build(): PostDAO {
    return this.post;
  }
}
