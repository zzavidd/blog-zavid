const { assert, fetch } = require('..');
const {
  GET_SINGLE_POST_QUERY,
  CREATE_POST_QUERY,
  UPDATE_POST_QUERY,
  DELETE_POST_QUERY
} = require('../../private/api/queries/post.queries');

/**
 * Submits a post to the server.
 * @param {object} post The post to submit.
 * @param {Function} [assertions] The assertions to make.
 * @returns {Promise} A resolution of the Promise.
 */
exports.submitPost = (post, assertions, isPublish = false) => {
  return Promise.resolve()
    .then(() => {
      // Submit the random post.
      return fetch(
        CREATE_POST_QUERY,
        { variables: { post, isPublish, isTest: true } },
        function ({ data }) {
          const createdPost = data.createPost;
          assert.hasAnyKeys(createdPost, 'id');
          return createdPost;
        }
      );
    })
    .then((createdPost) => {
      // Retrieve the post and run comparison.
      return fetch(
        GET_SINGLE_POST_QUERY,
        { variables: { id: createdPost.id } },
        function ({ data }) {
          const returnedPost = data.getSinglePost;
          if (assertions) assertions(returnedPost);
          return returnedPost.id;
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
exports.updatePost = (id, post, assertions, isPublish = false) => {
  return fetch(
    UPDATE_POST_QUERY,
    { variables: { id, post, isPublish, isTest: true } },
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
exports.deletePost = (id, assertions) => {
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
exports.comparePosts = (submission, output) => {
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
