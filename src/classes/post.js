class Post {

  static STATUSES = {
    DRAFT: 'DRAFT',
    PRIVATE: 'PRIVATE',
    PUBLISHED: 'PUBLISHED'
  };

  static TYPES = {
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

  static typeList = Object.values(this.TYPES).map((POST) => POST.TITLE);
  static statusList = Object.values(this.STATUSES);

  /**
   * Retrieves the post directory name from its type.
   * @param {string} type The post type.
   * @returns {string} The post's directory name.
   */
  static getDirectory(type) {
    const post = this.typeList.find((POST) => type === POST.TITLE);
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

  static isPage(type) {
    return type === this.TYPES.PAGE.TITLE;
  }

  static isReverie(type) {
    return type === this.TYPES.PAGE.TITLE;
  }

  static isPublish(status) {
    return status === this.STATUSES.PUBLISHED;
  }
}

module.exports = Post;
