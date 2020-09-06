const faker = require('faker');
const { zDate, zLogic, zString } = require('zavid-modules');

const { isObject, isString } = require('../../lib/helpers');
const dev = process.env.NODE_ENV !== 'production';

/** The map of post statuses. */
const POST_STATUSES = {
  DRAFT: 'DRAFT',
  PRIVATE: 'PRIVATE',
  PUBLISHED: 'PUBLISHED'
};

/** The map of post types. */
const POST_TYPES = {
  REVERIE: {
    TITLE: 'Reverie',
    DIRECTORY: 'reveries'
  },
  EPISTLE: {
    TITLE: 'Epistle',
    DIRECTORY: 'epistles'
  },
  POEM: {
    TITLE: 'Poem',
    DIRECTORY: 'poetry'
  },
  MUSING: {
    TITLE: 'Musing',
    DIRECTORY: 'musings'
  },
  PAGE: {
    TITLE: 'Page',
    DIRECTORY: 'pages'
  }
};

/** Lists for both status and type */
const typeList = Object.values(POST_TYPES).map((POST) => POST.TITLE);
const statusList = Object.values(POST_STATUSES);

/** The class for Post objects and methods. */
class Post {
  constructor() {
    this.post = {};
  }

  withType(type) {
    this.post.type = type;
    return this;
  }

  withStatus(status) {
    this.post.status = status;
    return this;
  }

  withDomain(id, type) {
    this.post.domainId = id;
    this.post.domainType = type;
    return this;
  }

  /**
   * Populates post object with random details.
   * @param {object} options - Random options.
   * @param {boolean} options.withImage - Include a cover image.
   * @param {number} options.numberOfContentImages - Include a specified number of content images.
   * @returns {Post} The post class.
   */
  random(options = {}) {
    const { withImage = false, numberOfContentImages = 0 } = options;

    this.post = {
      title: `Test: ${zString.toTitleCase(faker.company.catchPhrase())}`,
      type: getRandom(typeList),
      content: faker.lorem.paragraphs(),
      excerpt: faker.lorem.sentences(),
      status: getRandom(statusList),
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

  /**
   * Builds the post object.
   * @returns {object} The post object.
   */
  build() {
    return this.post;
  }

  static STATUSES = POST_STATUSES;
  static TYPES = POST_TYPES;

  static typeList = typeList;
  static statusList = statusList;

  /**
   * Ensure a post object is able to be operated on.
   * @param {object} post The post object.
   * @returns {object} The parsed post object.
   */
  static parse(post) {
    const images = post.contentImages;
    if (zLogic.isFalsy(images)) {
      post.contentImages = null;
      return post;
    }

    try {
      if (isString(images)) post.contentImages = JSON.parse(images);
    } catch {
      post.contentImages = null;
    }
    return post;
  }

  /**
   * Concatenate post images and return as a single list.
   * @param {object} post - The post object containing images.
   * @param {object} [options] - Options for image collation.
   * @param {boolean} [options.includeNulls] - Include null values when collating images.
   * @returns {object[]|string[]} The list of images.
   */
  static collateImages(post, options = {}) {
    const { includeNulls = false } = options;

    post = this.parse(post);
    const validImageUpload =
      !zLogic.isFalsy(post.image) && isObject(post.image);

    if (validImageUpload) post.image.isCover = true;

    const images = [post.image].concat(post.contentImages).filter((image) => {
      if (includeNulls) return true;
      if (image) {
        if (isObject(image) && image.source) return true;
        if (isString(image)) return true;
      }
      return false;
    });
    return images;
  }

  /**
   * Retrieves the post directory name from its type.
   * @param {string} type The post type.
   * @returns {string} The post's directory name.
   */
  static getDirectory(type) {
    const post = Object.values(this.TYPES).find((POST) => type === POST.TITLE);
    const directory = post ? post.DIRECTORY : '';
    debug(directory, `Could not match type "${type}" to find a directory.`);
    return directory;
  }

  /**
   * Finds a value from a post which matches a specification in a list of posts.
   * @param {object[]} posts The full list of posts.
   * @param {any} operand The value to compare with.
   * @param {string} field The field used to compare against.
   * @returns {any} The returned value from comparison.
   */
  static findInPosts(posts, operand, field) {
    const matchingPost = posts.find((post) => operand === post[field]) || {};
    debug(
      matchingPost,
      `Could not match operand "${operand}" to a post's "${field}".`
    );
    return matchingPost;
  }

  /**
   * Eagerly checks if post is of type page.
   * @param {string|object} input - The post or its type value.
   * @returns {boolean} True if post is PAGE.
   */
  static isPage(input) {
    return checkPostValue(input, 'type', this.TYPES.PAGE.TITLE);
  }

  /**
   * Eagerly checks if post is of type reverie.
   * @param {string|object} input - The post or its type value.
   * @returns {boolean} True if post is REVERIE.
   */
  static isReverie(input) {
    return checkPostValue(input, 'type', this.TYPES.REVERIE.TITLE);
  }

  /**
   * Checks if submission operation is a draft.
   * @param {string|object} input - The post or its status value.
   * @returns {boolean} True if the selected status is DRAFT.
   */
  static isDraft(input) {
    return checkPostValue(input, 'status', this.STATUSES.DRAFT);
  }

  /**
   * Checks if submission operation is private.
   * @param {string|object} input - The post or its status value.
   * @returns {boolean} True if the selected status is PRIVATE.
   */
  static isPrivate(input) {
    return checkPostValue(input, 'status', this.STATUSES.PRIVATE);
  }

  /**
   * Checks if submission operation is going to be published.
   * @param {string|object} input - The post or its status value.
   * @returns {boolean} True if the selected status is PUBLISHED.
   */
  static isPublish(input) {
    return checkPostValue(input, 'status', this.STATUSES.PUBLISHED);
  }
}

const checkPostValue = (input, field, expected) => {
  if (zLogic.isFalsy(input)) return false;

  if (isObject(input)) {
    return input[field] === expected;
  } else {
    return input === expected;
  }
};

const getRandom = (list) => {
  const random = Math.floor(Math.random() * list.length);
  return list[random];
};

const debug = (value, message) => {
  if (dev && zLogic.isFalsy(value)) console.warn(message);
};

module.exports = Post;
