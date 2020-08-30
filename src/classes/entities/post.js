const faker = require('faker');
const { zDate, zLogic, zString } = require('zavid-modules');
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

  withType(type){
    this.post.type = type;
    return this;
  }

  withStatus(status) {
    this.post.status = status;
    return this;
  }

  /**
   * Populates post object with random details.
   * @returns {Post} The post class.
   */
  random() {
    this.post = {
      title: `Test: ${zString.toTitleCase(faker.company.catchPhrase())}`,
      type: getRandom(typeList),
      content: faker.lorem.paragraphs(),
      excerpt: faker.lorem.sentences(),
      status: getRandom(statusList),
      datePublished: zDate.formatISODate(faker.date.past())
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
   * @param {string} comparand The field used to compare against.
   * @param {string} product The field value to return.
   * @returns {any} The returned value from comparison.
   */
  static findInPosts(posts, operand, comparand, product) {
    const post = posts.find((post) => operand === post[comparand]);
    const value = post ? post[product] : '';
    debug(
      value,
      `Could not match operand "${operand}" to a post's "${comparand}" to find a "${product}".`
    );
    return value;
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
  if (typeof input === 'object') {
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
