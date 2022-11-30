import * as faker from 'faker';

import { IPostStatus, IPostType } from 'constants/enums';
import ZDate from 'lib/date';
import ZString from 'lib/string';

import { PostStatic } from './PostStatic';

/** The class for Post objects and methods. */
export class PostBuilder {
  private post: PostDAO = {
    title: '',
    content: '',
    type: IPostType.REVERIE,
    typeId: undefined,
    excerpt: '',
    image: {
      source: '',
      hasChanged: false,
    },
    contentImages: {},
    status: IPostStatus.DRAFT,
    datePublished: new Date(),
    domainId: undefined,
    slug: null,
    tags: [],
  };

  public withTitle(title?: string): PostBuilder {
    this.post.title = title!.trim();
    return this;
  }

  public withType(type: PostType): PostBuilder {
    this.post.type = type;
    return this;
  }

  public withTypeId(typeId?: number): PostBuilder {
    this.post.typeId = typeId;
    return this;
  }

  public withContent(content?: string): PostBuilder {
    this.post.content = content!.trim();
    return this;
  }

  public withStatus(status?: PostStatus): PostBuilder {
    this.post.status = status;
    return this;
  }

  public withExcerpt(excerpt?: string): PostBuilder {
    this.post.excerpt = excerpt!.trim();
    return this;
  }

  public withImage(image: PostImage | string | null): PostBuilder {
    this.post.image = image;
    return this;
  }

  public withContentImages(contentImages?: PostImage[]): PostBuilder {
    this.post.contentImages = contentImages;
    return this;
  }

  public withDatePublished(date: string | Date): PostBuilder {
    this.post.datePublished = date;
    return this;
  }

  public withDomain(id?: number): PostBuilder {
    id = typeof id && parseInt(id as unknown as string);
    this.post.domainId = id;
    return this;
  }

  public random(options: RandomPostOptions = {}): PostBuilder {
    const {
      allowPageTypes = true,
      withImage = false,
      numberOfContentImages = 0,
    } = options;

    const title = `Test: ${ZString.toTitleCase(faker.company.catchPhrase())}`;

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

  public withRandomType(allowPageTypes?: boolean): PostBuilder {
    this.post.type = PostStatic.randomType({ allowPageTypes });
    return this;
  }

  public withRandomStatus(): PostBuilder {
    this.post.status = PostStatic.randomStatus();
    return this;
  }

  public withRandomDate(): PostBuilder {
    this.post.datePublished = ZDate.formatISO(faker.date.past());
    return this;
  }

  public withRandomContent(threshold?: number, limit?: number): PostBuilder {
    const contentType = PostStatic.getContentType(this.post.type!);
    this.post.content = PostStatic.randomContent(contentType, threshold, limit);
    return this;
  }

  public withRandomExcerpt(): PostBuilder {
    this.post.excerpt = faker.lorem.sentences(1);
    return this;
  }

  public withRandomImage(withImage: boolean): PostBuilder {
    this.post.image = {
      source: withImage ? faker.image.image() : '',
      hasChanged: withImage,
    };
    return this;
  }

  public withRandomContentImages(quantity: number): PostBuilder {
    this.post.contentImages = new Array(quantity).fill({
      source: faker.image.image(),
      hasChanged: true,
    });
    return this;
  }

  public build(): PostDAO {
    return this.post;
  }
}
