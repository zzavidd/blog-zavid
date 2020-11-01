const { assert, classes, debug, fetch } = require('..');
const { GET_POSTS_QUERY } = require('../../src/private/api/queries/post.queries');
const { retrieveResource, extractPublicId } = require('../helper');
const {
  submitPost,
  updatePost,
  deletePost,
  comparePosts
} = require('../helper/post.helper');

const { PostStatic, PostBuilder } = classes;

describe('Service Tests: PostStatic', function () {
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
        PostStatic.TYPE.REVERIE,
        PostStatic.TYPE.EPISTLE
      ];
      const excludedTypes = PostStatic.TYPES.filter(function (val) {
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
        PostStatic.TYPE.REVERIE,
        PostStatic.TYPE.EPISTLE
      ];
      const includedTypes = PostStatic.TYPES.filter(function (val) {
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

  describe('Create PostStatic', function () {
    it('Without image', function (finish) {
      const post = new PostBuilder().random().build();
      submitPost(post, (readPost) => {
        comparePosts(post, readPost);
        deletePost(readPost.id, finish);
      });
    });

    it('With image', function (finish) {
      const post = new PostBuilder()
        .random({ withImage: true, numberOfContentImages: 2 })
        .build();

      let publicId;
      let postId;

      Promise.resolve()
        .then(() => {
          return submitPost(post, (readPost) => {
            postId = readPost.id;
            publicId = extractPublicId(readPost.image);
          });
        })
        .then(() => retrieveResource(publicId))
        .then((resources) => {
          assert.isNotEmpty(resources);
          assert.strictEqual(resources[0].public_id, publicId);
          deletePost(postId, finish);
        })
        .catch(debug);
    });

    it('Different statuses', function (finish) {
      const draftPost = new PostBuilder()
        .random()
        .withStatus(PostStatic.STATUS.DRAFT)
        .build();
      const privatePost = new PostBuilder()
        .random()
        .withStatus(PostStatic.STATUS.PRIVATE)
        .build();
      const publishedPost = new PostBuilder()
        .random()
        .withStatus(PostStatic.STATUS.PUBLISHED)
        .build();

      Promise.all([
        submitPost(draftPost, (readPost) => {
          assert.isNull(readPost.slug);
          return deletePost(readPost.id);
        }),
        submitPost(privatePost, (readPost) => {
          assert.isNotNull(readPost.slug);
          return deletePost(readPost.id);
        }),
        submitPost(publishedPost, (readPost) => {
          assert.isNotNull(readPost.slug);
          deletePost(readPost.id);
        })
      ])
        .then(() => finish())
        .catch(debug);
    });
  });

  describe('Update PostStatic', function () {
    it('Without image', function (finish) {
      const postToSubmit = new PostBuilder().random().build();
      const postForUpdate = new PostBuilder().random().build();
      Promise.resolve()
        .then(() => {
          return submitPost(postToSubmit);
        })
        .then((id) => {
          updatePost(id, postForUpdate, (updatedPost) => {
            comparePosts(postForUpdate, updatedPost);
            assert.strictEqual(id, updatedPost.id);
            deletePost(id, finish);
          });
        })
        .catch(debug);
    });

    it('With images', function (finish) {
      const postToSubmit = new PostBuilder()
        .random({ withImage: true, numberOfContentImages: 2 })
        .build();
      const postForUpdate = new PostBuilder()
        .random({ withImage: true, numberOfContentImages: 2 })
        .build();

      let postId;
      let publicIdSubmit;
      let publicIdUpdate;

      Promise.resolve()
        .then(() => {
          return submitPost(postToSubmit, (submittedPost) => {
            postId = submittedPost.id;
            publicIdSubmit = extractPublicId(submittedPost.image);
          });
        })
        .then(() => {
          updatePost(postId, postForUpdate, (updatedPost) => {
            publicIdUpdate = extractPublicId(updatedPost.image);
            assert.notEqual(publicIdSubmit, publicIdUpdate);
            deletePost(postId, finish);
          });
        })
        .catch(debug);
    });
  });
});
