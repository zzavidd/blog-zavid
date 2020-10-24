const faker = require('faker');
const { zDate, zString } = require('zavid-modules');

const Post = require('../../static/post.static');

/** The class for Post objects and methods. */
class PostBuilder {
  constructor() {
    this.post = {};
  }

  withTitle(title) {
    this.post.title = title;
    return this;
  }

  withType(type) {
    this.post.type = type;
    return this;
  }

  withTypeId(typeId) {
    this.post.typeId = typeId;
    return this;
  }

  withContent(content) {
    this.post.content = content;
    return this;
  }

  withStatus(status) {
    this.post.status = status;
    return this;
  }

  withDatePublished(date) {
    this.post.datePublished = date;
    return this;
  }

  withDomain(id) {
    this.post.domainId = id;
    return this;
  }

  /**
   * Populates post object with random details.
   * @param {object} options - Random options.
   * @param {boolean} options.withImage - Include a cover image.
   * @param {number} options.numberOfContentImages - Include a specified number of content images.
   * @returns {PostBuilder} The post builder class.
   */
  random(options = {}) {
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

  withRandomExcerpt() {
    this.post.excerpt = faker.lorem.sentences(1);
    return this;
  }

  withRandomImage() {
    this.post.image = {
      source: faker.image.image(),
      hasChanged: true
    };
    return this;
  }

  /**
   * Builds the post object.
   * @returns {object} The post object.
   */
  build() {
    return this.post;
  }
}

module.exports = PostBuilder;