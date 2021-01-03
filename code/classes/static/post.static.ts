import { isString, randomEnumValue, randomElementFromList } from '../helper';
import { PostDAO, PostImage, PostType, PostStatus } from '../interfaces';

const PostDirectory: Record<PostType, string> = {
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

  static randomType(options: RandomTypeOptions = {}): PostType {
    const { allowPageTypes = true } = options;
    const postTypes = this.TYPES.filter((type) => {
      if (!allowPageTypes && type === PostType.PAGE) return false;
      return true;
    });
    return randomElementFromList(postTypes);
  }

  /**
   * Ensure a post object is able to be operated on.
   */
  static parse(post: PostDAO): PostDAO {
    const images = post.contentImages;

    if (!images || !images.length) {
      delete post.contentImages;
      return post;
    }

    try {
      if (isString(images)) {
        post.contentImages = JSON.parse(images as string);
      }
    } catch {
      delete post.contentImages;
    }
    return post;
  }

  /**
   * Collates a post's images into an array.
   * @param post The post object containing images.
   * @param options - Options for image collation.
   */
  static collateImages(
    post: PostDAO,
    options: CollateImageOptions = {}
  ): (PostImage | string)[] {
    const { includeNulls = false } = options;

    post = this.parse(post);
    if (this.isPostImageToUpload(post.image!)) post.image.isCover = true;

    const medium = post.contentImages as PostImage[] | string[];

    const images = [post.image].concat(medium).filter((image) => {
      if (includeNulls) return true;
      if (image) return true;
      return false;
    });

    return images as PostImage[] | string[];
  }

  static isPostImageToUpload(image: PostImage | string): image is PostImage {
    if (!image || image === null) return false;
    return !!(image as PostImage).source;
  }

  /**
   * Retrieves the post directory name from its type.
   * @param type The post type.
   */
  static getDirectory(type: PostType): string {
    return PostDirectory[type];
  }

  /**
   * Eagerly checks if post is of type page.
   * @param {PostDAO} input - The post or its type value.
   * @returns {boolean} True if post is PAGE.
   */
  static isPage(input: PostDAO): boolean {
    return input?.type === PostType.PAGE;
  }

  /**
   * Eagerly checks if post is of type reverie.
   * @param input - The post or its type value.
   */
  static isReverie(input: PostDAO): boolean {
    return input?.type === PostType.REVERIE;
  }

  /**
   * Eagerly checks if post is of type reverie.
   * @param input - The post or its type value.
   */
  static isEpistle(input: PostDAO): boolean {
    return input?.type === PostType.EPISTLE;
  }

  static randomStatus(): PostStatus {
    return randomEnumValue(PostStatus);
  }

  /**
   * Checks if a post has the DRAFT status.
   */
  static isDraft(input: PostDAO): boolean {
    return input?.status === PostStatus.DRAFT;
  }

  /**
   * Checks if a post has the PROTECTED status.
   */
  static isProtected(input: PostDAO): boolean {
    return input?.status === PostStatus.PROTECTED;
  }

  static isPrivate(input: PostDAO): boolean {
    return input?.status === PostStatus.PRIVATE;
  }

  static isPublish(input: PostDAO): boolean {
    return input?.status === PostStatus.PUBLISHED;
  }

  /**
   * Retrieve the title of the post. Epistles are formatted with their type ID
   * numbers.
   * @param post The post to retrieve its title.
   */
  static getPostTitle(post: PostDAO): string {
    let title;

    if (this.isEpistle(post)) {
      title = `#${post.typeId}: ${post.title!}`;
    } else {
      title = post.title!;
    }

    return title;
  }
}

interface CollateImageOptions {
  includeNulls?: boolean;
}

interface RandomTypeOptions {
  allowPageTypes?: boolean;
}
