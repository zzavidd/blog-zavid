const faker = require('faker');
const { zDate, zString } = require('zavid-modules');

const Post = require('../../static/post.static');

/** The class for Post objects and methods. */
class PostBuilder {
  post: PostDAO;

  withTitle(title: string): PostBuilder {
    this.post.title = title;
    return this;
  }

  withType(type: string): PostBuilder {
    this.post.type = type;
    return this;
  }

  withTypeId(typeId: string): PostBuilder {
    this.post.typeId = typeId;
    return this;
  }

  withContent(content: string): PostBuilder {
    this.post.content = content;
    return this;
  }

  withStatus(status: string): PostBuilder {
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

  random(options: PostImageOptions = {}): PostBuilder {
    const { withImage = false, numberOfContentImages = 0 } = options;
    this.post = {
      title: `Test: ${zString.toTitleCase(faker.company.catchPhrase())}`,
      type: Post.randomType(),
      typeId: faker.random.number(),
      content: faker.lorem.paragraphs().replace(/\n/g, '\n\n'),
      excerpt: faker.lorem.sentences(),
      status: Post.randomStatus(),
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

  build() {
    return this.post;
  }
}

interface PostDAO {
  title: string;
  type: string;
  typeId: string;
  content: string;
  status: string;
  excerpt: string;
  datePublished: string | Date;
  image?: String | PostImage;
  contentImages?: String | String[] | PostImage[];
  domainId?: number;
}

interface PostImage {
  source: string;
  hasChanged: boolean;
}

interface PostImageOptions {
  withImage?: boolean;
  numberOfContentImages?: number;
}

module.exports = PostBuilder;