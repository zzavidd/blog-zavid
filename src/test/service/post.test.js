const { Post } = require('../../classes');
const {
  GET_POSTS_QUERY,
  GET_SINGLE_POST_QUERY,
  CREATE_POST_QUERY,
  UPDATE_POST_QUERY,
  DELETE_POST_QUERY
} = require('../../private/api/queries');
const { assert, fetch } = require('../setup');

describe('Post Tests', function () {
  let POST_ID = 0;

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

    it('With type', function (finish) {
      const type = Post.TYPES.REVERIE.TITLE || 'Reverie';
      fetch(GET_POSTS_QUERY, { variables: { type } }, function ({ data }) {
        data.getAllPosts.forEach((post) => {
          assert.equal(post.type, type);
        });
        finish();
      });
    });
  });

  describe('Create Post', function () {
    it('', function (finish) {
      const post = new Post().random().build();

      Promise.resolve()
        .then(() => {
          // Submit the random post.
          return fetch(CREATE_POST_QUERY, { variables: { post } }, function ({
            data
          }) {
            const createdPost = data.createPost;
            assert.hasAnyKeys(createdPost, 'id');
            POST_ID = createdPost.id;
            return createdPost;
          });
        })
        .then((createdPost) => {
          // Retrieve the post and run comparison.
          return fetch(
            GET_SINGLE_POST_QUERY,
            { variables: { id: createdPost.id } },
            function ({ data }) {
              const readPost = data.getSinglePost;
              comparePosts(post, readPost);
              finish();
            }
          );
        });
    });
  });

  describe('Update Post', function () {
    it('', function (finish) {
      const post = new Post().random().build();
      fetch(
        UPDATE_POST_QUERY,
        { variables: { id: POST_ID, post, imageHasChanged: false } },
        function ({ data }) {
          const updatedPost = data.updatePost;
          assert.strictEqual(updatedPost.id, POST_ID);
          comparePosts(post, updatedPost);
          finish();
        }
      );
    });
  });

  describe('Delete Post', function () {
    it('', function (finish) {
      Promise.resolve()
        .then(() => {
          // Delete the post.
          return fetch(
            DELETE_POST_QUERY,
            { variables: { id: POST_ID } },
            function ({ data }) {
              const deletedPost = data.deletePost;
              assert.hasAnyKeys(deletedPost, 'id');
            }
          );
        })
        .then(() => {
          // Attempt to retrieve post and expect failure.
          return fetch(
            GET_SINGLE_POST_QUERY,
            { variables: { id: POST_ID }, expectToFail: true },
            function ({ errors }) {
              assert.isOk(errors);
              finish();
            }
          );
        });
    });
  });
});

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
