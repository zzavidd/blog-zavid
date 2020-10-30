const { zLogic } = require('zavid-modules');

const { Publishable } = require('./super');

const { isObject, isString, getRandom } = require('../helper');
const dev = process.env.NODE_ENV !== 'production';

enum STATUS {
  DRAFT,
  PRIVATE,
  PUBLISHED
}

enum TYPE {
  REVERIE = 'Reverie',
  EPISTLE = 'Epistle',
  POEM = 'Poem',
  MUSING = 'Musing',
  PAGE = 'Page'
}

const DIRECTORY = {
  [TYPE.REVERIE]: 'reveries',
  [TYPE.EPISTLE]: 'epistles',
  [TYPE.POEM]: 'Poem',
  [TYPE.MUSING]: 'musings',
  [TYPE.PAGE]: 'pages'
};

class PostStatic extends Publishable {
  static TYPE = TYPE;
  static TYPES = Object.values(TYPE);
  static STATUS = STATUS;
  static STATUSES = Object.values(STATUS);

  static randomType(): string {
    return getRandom(this.TYPES);
  }

  /**
   * Ensure a post object is able to be operated on.
   * @param {object} post The post object.
   * @returns {object} The parsed post object.
   */
  static parse(post: PostDAO): PostDAO {
    const images = post.contentImages;
    if (zLogic.isFalsy(images)) {
      post.contentImages = null;
      return post;
    }

    try {
      if (isString(images)) {
        post.contentImages = JSON.parse(images as string);
      }
    } catch {
      post.contentImages = null;
    }
    return post;
  }

  /**
   * Concatenate post images and return as a single list.
   * @param {PostDAO} post - The post object containing images.
   * @param {CollateImageOptions} [options] - Options for image collation.
   * @returns {(PostDAO|string)[]} The list of images.
   */
  static collateImages(
    post: PostDAO,
    options?: CollateImageOptions
  ): (PostImage | string)[] {
    const { includeNulls = false } = options;

    post = this.parse(post);
    if (this.isPostImageToUpload(post.image)) post.image.isCover = true;

    const images = [post.image].concat(post.contentImages).filter((image) => {
      if (includeNulls) return true;
      if (image) {
        if (this.isPostImageToUpload(post.image)) return true;
        if (isString(image)) return true;
      }
      return false;
    });

    return images;
  }

  static isPostImageToUpload(image: PostImage | String): image is PostImage {
    return (image as PostImage).source !== undefined;
  }

  /**
   * Retrieves the post directory name from its type.
   * @param {string} type The post type.
   * @returns {string} The post's directory name.
   */
  static getDirectory(type: string): string {
    return DIRECTORY[type];
  }

  /**
   * Eagerly checks if post is of type page.
   * @param {PostDAO} input - The post or its type value.
   * @returns {boolean} True if post is PAGE.
   */
  static isPage(input: PostDAO): boolean {
    return input.type === TYPE.PAGE;
  }

  /**
   * Eagerly checks if post is of type reverie.
   * @param {PostDAO} input - The post or its type value.
   * @returns {boolean} True if post is REVERIE.
   */
  static isReverie(input: PostDAO): boolean {
    return input.type === TYPE.REVERIE;
  }

  /**
   * Checks if submission operation is a draft.
   * @param {PostDAO} input - The post or its status value.
   * @returns {boolean} True if the selected status is DRAFT.
   */
  static isDraft(input: PostDAO): boolean {
    return input.status === STATUS.DRAFT.toString();
  }
}

interface CollateImageOptions {
  includeNulls: boolean;
}

module.exports = PostStatic;
