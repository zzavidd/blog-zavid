const { zLogic } = require('zavid-modules');

const { Publishable } = require('./super');

const { isObject, isString, getRandom, checkPostValue } = require('../helper');
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

class Post extends Publishable {
  static STATUSES = POST_STATUSES;
  static TYPES = POST_TYPES;

  static typeList = typeList;
  static statusList = statusList;

  static randomType() {
    return getRandom(this.typeList);
  }

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
}

const debug = (value, message) => {
  if (dev && zLogic.isFalsy(value)) console.warn(message);
};

module.exports = Post;
