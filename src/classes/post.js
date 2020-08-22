const { POST_TYPES } = require('constants/strings');
const postTypes = Object.values(POST_TYPES);

class Post {
  /** A list of post types. */
  static types = Object.values(POST_TYPES).map((POST) => POST.TITLE);

  /**
   * Retrieves the post directory name from its name.
   * @param {string} name The post name.
   * @returns {string} The post's directory name.
   */
  static getDirectory(name) {
    const post = postTypes.find((POST) => name === POST.TITLE);
    const directory = post ? post.DIRECTORY : '';
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
    return value;
  }

  /**
   * Checks if post is of type page.
   * @param {string} type The post type.
   * @returns {boolean} The page's directory name.
   */
  static isPage(type) {
    return type === POST_TYPES.PAGE.TITLE;
  }
}

export default Post;
