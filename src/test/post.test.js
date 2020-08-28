const { assert, fetch: fetch } = require('./setup');
const { Post } = require('../classes');

const { GET_POSTS_QUERY } = require('../private/api/queries');

describe('Post Tests', function () {
  describe('Get All Posts', function () {
    it('All', function (finish) {
      fetch(GET_POSTS_QUERY).then(({ data }) => {
        assert.isOk(data);
        finish();
      });
    });

    it('With limit', function (finish) {
      const limit = 5;
      fetch(GET_POSTS_QUERY, { variables: { limit } }).then(({ data }) => {
        assert.lengthOf(data.getAllPosts, limit);
        finish();
      });
    });

    it('With type', function (finish) {
      const type = Post.TYPES.REVERIE.TITLE || 'Reverie';
      fetch(GET_POSTS_QUERY, { variables: { type } }).then(({ data }) => {
        assert.isOk(data.getAllPosts);
        data.getAllPosts.forEach((post) => {
          assert.equal(post.type, type, 'Bad');
        });
        finish();
      });
    });
  });
});
