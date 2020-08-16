/** The status of the blog articles */
exports.POST_STATUS = {
  DRAFT: 'DRAFT',
  PRIVATE: 'PRIVATE',
  PUBLISHED: 'PUBLISHED'
};

exports.POST_TYPES = {
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

/** The CRUD operations for all entities */
exports.OPERATIONS = {
  CREATE: 'add',
  UPDATE: 'edit'
};