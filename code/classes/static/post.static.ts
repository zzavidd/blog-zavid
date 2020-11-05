const { zLogic } = require('zavid-modules');

import { isString, randomEnumValue } from '../helper';
import {
  PostDAO,
  PostImage,
  PostType,
  PostStatus
} from '../interfaces/post.interface';

interface DirectoryMapping {
  [type: string]: string
}

const DIRECTORY: DirectoryMapping = {
  [PostType.REVERIE]: 'reveries',
  [PostType.EPISTLE]: 'epistles',
  [PostType.POEM]: 'poetry',
  [PostType.MUSING]: 'musings',
  [PostType.PAGE]: 'pages'
};

export class PostStatic {
  static TYPE = PostType;
  static TYPES = Object.values(PostType);
  static STATUS = PostStatus;
  static STATUSES = Object.values(PostStatus);

  static randomType(): PostType {
    return randomEnumValue(PostType);
  }

  /**
   * Ensure a post object is able to be operated on.
   * @param {object} post The post object.
   * @returns {object} The parsed post object.
   */
  static parse(post: PostDAO): PostDAO {
    const images = post.contentImages;
    if (zLogic.isFalsy(images)) {
      post.contentImages = null as any;
      return post;
    }

    try {
      if (isString(images)) {
        post.contentImages = JSON.parse(images as string);
      }
    } catch {
      post.contentImages = null as any;
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
    options: CollateImageOptions = {}
  ): (PostImage | string)[] {
    const { includeNulls = false } = options;

    post = this.parse(post);
    if (this.isPostImageToUpload(post.image!)) post.image.isCover = true;

    const images = [post.image].concat(post.contentImages).filter((image) => {
      if (includeNulls) return true;
      if (image) return true;
      return false;
    });

    return images as PostImage[] | string[];
  }

  static isPostImageToUpload(image: PostImage | string): image is PostImage {
    if (image === null) return false;
    return !!(image as PostImage).source;
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
    return input.type === PostType.PAGE;
  }

  /**
   * Eagerly checks if post is of type reverie.
   * @param {PostDAO} input - The post or its type value.
   * @returns {boolean} True if post is REVERIE.
   */
  static isReverie(input: PostDAO): boolean {
    return input.type === PostType.REVERIE;
  }

  static randomStatus(): PostStatus {
    return randomEnumValue(PostStatus);
  }

  /**
   * Checks if submission operation is a draft.
   * @param {PostDAO} input - The post or its status value.
   * @returns {boolean} True if the selected status is DRAFT.
   */
  static isDraft(input: PostDAO): boolean {
    return input.status === PostStatus.DRAFT;
  }

  static isPrivate(input: PostDAO): boolean {
    return input.status === PostStatus.PRIVATE;
  }

  static isPublish(input: PostDAO): boolean {
    return input.status === PostStatus.PUBLISHED;
  }
}

interface CollateImageOptions {
  includeNulls?: boolean;
}
