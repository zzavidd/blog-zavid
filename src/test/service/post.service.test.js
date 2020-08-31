const { assert, debug, fetch } = require('..');
const { Post } = require('../../classes');
const { GET_POSTS_QUERY } = require('../../private/api/queries');
const {
  submitPost,
  updatePost,
  deletePost,
  comparePosts
} = require('../helper/post.helper');

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
        })
        .catch(debug);
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
        })
        .catch(debug);
    });
  });
});
