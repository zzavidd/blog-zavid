import * as faker from 'faker';
import { zDate, zString } from 'zavid-modules';

import {
  PostStatic,
  PostDAO,
  RandomPostOptions,
  PostType,
  PostStatus,
  PostImage,
} from '../../index';

/** The class for Post objects and methods. */
export class PostBuilder {
  private post: PostDAO = {};

  withTitle(title?: string): PostBuilder {
    this.post.title = title!.trim();
    return this;
  }

  withType(type?: PostType): PostBuilder {
    this.post.type = type;
    return this;
  }

  withTypeId(typeId?: number): PostBuilder {
    this.post.typeId = typeId;
    return this;
  }

  withContent(content?: string): PostBuilder {
    this.post.content = content!.trim();
    return this;
  }

  withStatus(status?: PostStatus): PostBuilder {
    this.post.status = status;
    return this;
  }

  withExcerpt(excerpt?: string): PostBuilder {
    this.post.excerpt = excerpt!.trim();
    return this;
  }

  withImage(image?: PostImage | string): PostBuilder {
    this.post.image = image;
    return this;
  }

  withContentImages(contentImages?: PostImage[]): PostBuilder {
    this.post.contentImages = contentImages;
    return this;
  }

  withDatePublished(date?: string | Date): PostBuilder {
    this.post.datePublished = date;
    return this;
  }

  withDomain(id?: number): PostBuilder {
    id = typeof id && parseInt(id as unknown as string);
    this.post.domainId = id;
    return this;
  }

  random(options: RandomPostOptions = {}): PostBuilder {
    const {
      allowPageTypes = true,
      withImage = false,
      numberOfContentImages = 0,
    } = options;

    const title = `Test: ${zString.toTitleCase(faker.company.catchPhrase())}`;

    this.post = this.withTitle(title)
      .withRandomType(allowPageTypes)
      .withRandomContent()
      .withRandomExcerpt()
      .withRandomStatus()
      .withRandomDate()
      .withRandomImage(withImage)
      .withRandomContentImages(numberOfContentImages)
      .build();

    if (!PostStatic.isPage(this.post)) {
      this.post.typeId = faker.random.number();
    }

    return this;
  }

  withRandomType(allowPageTypes?: boolean): PostBuilder {
    this.post.type = PostStatic.randomType({ allowPageTypes });
    return this;
  }

  withRandomStatus(): PostBuilder {
    this.post.status = PostStatic.randomStatus();
    return this;
  }

  withRandomDate(): PostBuilder {
    this.post.datePublished = zDate.formatISODate(faker.date.past());
    return this;
  }

  withRandomContent(threshold?: number, limit?: number): PostBuilder {
    const contentType = PostStatic.getContentType(this.post.type!);
    this.post.content = PostStatic.randomContent(contentType, threshold, limit);
    return this;
  }

  withRandomExcerpt(): PostBuilder {
    this.post.excerpt = faker.lorem.sentences(1);
    return this;
  }

  withRandomImage(withImage: boolean): PostBuilder {
    this.post.image = {
      source: withImage ? faker.image.image() : '',
      hasChanged: withImage,
    };
    return this;
  }

  withRandomContentImages(quantity: number): PostBuilder {
    this.post.contentImages = new Array(quantity).fill({
      source: faker.image.image(),
      hasChanged: true,
    });
    return this;
  }

  build(): PostDAO {
    return this.post;
  }
}
