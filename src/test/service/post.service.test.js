const { Post } = require('../../classes');
const {
  GET_POSTS_QUERY,
  GET_SINGLE_POST_QUERY,
  CREATE_POST_QUERY,
  UPDATE_POST_QUERY,
  DELETE_POST_QUERY
} = require('../../private/api/queries');
const { assert, fetch } = require('../setup');

describe('Service Tests: Post', function () {
  describe('Get All Posts', function () {
    it('All', function (finish) {
      fetch(GET_POSTS_QUERY, {}, function ({ data }) {
        assert.isOk(data.getAllPosts);
        finish();
      });
    });

    it('With limit', function (finish) {
      const limit = 5;
      fetch(GET_POSTS_QUERY, { variables: { limit } }, function ({ data }) {
        assert.lengthOf(data.getAllPosts, limit);
        finish();
      });
    });

    it('Including types', function (finish) {
      const includedTypes = [
        Post.TYPES.REVERIE.TITLE,
        Post.TYPES.EPISTLE.TITLE
      ];
      const excludedTypes = Post.typeList.filter(function (val) {
        return includedTypes.indexOf(val) == -1;
      });
      fetch(
        GET_POSTS_QUERY,
        { variables: { type: { include: includedTypes } } },
        function ({ data }) {
          data.getAllPosts.forEach((post) => {
            assert.include(includedTypes, post.type);
            assert.notInclude(excludedTypes, post.type);
          });
          finish();
        }
      );
    });

    it('Excluding types', function (finish) {
      const excludedTypes = [
        Post.TYPES.REVERIE.TITLE,
        Post.TYPES.EPISTLE.TITLE
      ];
      const includedTypes = Post.typeList.filter(function (val) {
        return excludedTypes.indexOf(val) == -1;
      });
      fetch(
        GET_POSTS_QUERY,
        { variables: { type: { exclude: excludedTypes } } },
        function ({ data }) {
          data.getAllPosts.forEach((post) => {
            assert.include(includedTypes, post.type);
            assert.notInclude(excludedTypes, post.type);
          });
          finish();
        }
      );
    });
  });

  describe('Create Post', function () {
    it('Without image', function (finish) {
      const post = new Post().random().build();
      submitPost(post, (readPost) => {
        comparePosts(post, readPost);
        deletePost(readPost.id, finish);
      });
    });

    it('Different statuses', function (finish) {
      const draftPost = new Post()
        .random()
        .withStatus(Post.STATUSES.DRAFT)
        .build();
      const privatePost = new Post()
        .random()
        .withStatus(Post.STATUSES.PRIVATE)
        .build();
      const publishedPost = new Post()
        .random()
        .withStatus(Post.STATUSES.PUBLISHED)
        .build();

      Promise.resolve()
        .then(() => {
          return submitPost(draftPost, (readPost) => {
            assert.isNull(readPost.slug);
            return deletePost(readPost.id);
          });
        })
        .then(() => {
          return submitPost(privatePost, (readPost) => {
            assert.isNotNull(readPost.slug);
            return deletePost(readPost.id);
          });
        })
        .then(() => {
          return submitPost(publishedPost, (readPost) => {
            assert.isNotNull(readPost.slug);
            deletePost(readPost.id, finish);
          });
        });
    });
  });

  describe('Update Post', function () {
    it('Without image', function (finish) {
      const post = new Post().random().build();
      Promise.resolve()
        .then(() => {
          return submitPost(post);
        })
        .then((id) => {
          updatePost(id, post, (updatedPost) => {
            comparePosts(post, updatedPost);
            deletePost(id, finish);
          });
        });
    });
  });
});

/**
 * Submits a post to the server.
 * @param {object} post The post to submit.
 * @param {Function} [assertions] The assertions to make.
 * @returns {Promise} A resolution of the Promise.
 */
const submitPost = (post, assertions) => {
  return Promise.resolve()
    .then(() => {
      // Submit the random post.
      return fetch(CREATE_POST_QUERY, { variables: { post } }, function ({
        data
      }) {
        const createdPost = data.createPost;
        assert.hasAnyKeys(createdPost, 'id');
        return createdPost;
      });
    })
    .then((createdPost) => {
      // Retrieve the post and run comparison.
      return fetch(
        GET_SINGLE_POST_QUERY,
        { variables: { id: createdPost.id } },
        function ({ data }) {
          if (assertions) assertions(data.getSinglePost);
          return data.getSinglePost.id;
        }
      );
    });
};

/**
 * Updates a post on the server.
 * @param {number} id The ID of the post to update.
 * @param {object} post The post to update.
 * @param {Function} [assertions] The assertions to make.
 * @returns {Promise} A resolution of the Promise.
 */
const updatePost = (id, post, assertions) => {
  return fetch(
    UPDATE_POST_QUERY,
    { variables: { id, post, imagesHaveChanged: false } },
    function ({ data }) {
      const updatedPost = data.updatePost;
      assert.strictEqual(updatedPost.id, id);
      if (assertions) assertions(updatedPost);
    }
  );
};

/**
 * Deletes a post from the server.
 * @param {number} id The ID of the post to delete.
 * @param {Function} [assertions] The assertions to make.
 * @returns {Promise} A resolution of the Promise.
 */
const deletePost = (id, assertions) => {
  return Promise.resolve()
    .then(() => {
      // Delete the post.
      return fetch(DELETE_POST_QUERY, { variables: { id } }, function ({
        data
      }) {
        const deletedPost = data.deletePost;
        assert.hasAnyKeys(deletedPost, 'id');
      });
    })
    .then(() => {
      // Attempt to retrieve post and expect failure.
      return fetch(
        GET_SINGLE_POST_QUERY,
        { variables: { id }, expectToFail: true },
        function ({ errors }) {
          assert.isOk(errors);
          if (assertions) assertions();
        }
      );
    });
};

/**
 * Compares to post objects.
 * @param {object} submission The post submitted from client.
 * @param {object} output The post returned from server.
 */
const comparePosts = (submission, output) => {
  assert.strictEqual(submission.title, output.title);
  assert.strictEqual(submission.type, output.type);
  assert.strictEqual(submission.content, output.content);
  assert.strictEqual(submission.excerpt, output.excerpt);
  assert.strictEqual(submission.status, output.status);
  assert.strictEqual(
    new Date(submission.datePublished).getUTCMilliseconds,
    new Date(parseInt(output.datePublished)).getUTCMilliseconds
  );
};
