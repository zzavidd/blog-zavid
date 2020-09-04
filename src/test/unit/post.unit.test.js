const { assert } = require('..');
const { Post } = require('../../classes');
const { comparePosts } = require('../helper/post.helper');

describe('Unit Tests: Post', function () {
  describe('Object methods', function () {
    it('Test random construction', function (finish) {
      const post = new Post().random({ numberOfContentImages: 4 }).build();
      isArrayOfLength(post.contentImages, 4);
      finish();
    });
  });

  describe('Static methods', function () {
    it('Check post type', function (finish) {
      const reverie = new Post()
        .random()
        .withType(Post.TYPES.REVERIE.TITLE)
        .build();
      assert.isTrue(Post.isReverie(reverie));
      assert.isTrue(Post.isReverie(reverie.type));

      const page = new Post().random().withType(Post.TYPES.PAGE.TITLE).build();
      assert.isTrue(Post.isPage(page));
      assert.isTrue(Post.isPage(page.type));
      finish();
    });

    it('Check post status', function (finish) {
      const draftPost = new Post()
        .random()
        .withStatus(Post.STATUSES.DRAFT)
        .build();
      assert.isTrue(Post.isDraft(draftPost));
      assert.isTrue(Post.isDraft(draftPost.status));

      const privatePost = new Post()
        .random()
        .withStatus(Post.STATUSES.PRIVATE)
        .build();
      assert.isTrue(Post.isPrivate(privatePost));
      assert.isTrue(Post.isPrivate(privatePost.status));

      const publishPost = new Post()
        .random()
        .withStatus(Post.STATUSES.PUBLISHED)
        .build();
      assert.isTrue(Post.isPublish(publishPost));
      assert.isTrue(Post.isPublish(publishPost.status));
      finish();
    });

    it('Find post by comparison', function (finish) {
      const post = new Post().random().build();
      const posts = [post];

      const matchedPost = Post.findInPosts(posts, post.id, 'id');
      comparePosts(post, matchedPost);
      finish();
    });

    it('Parse post', function (finish) {
      const post = new Post()
        .random({ withImage: true, numberOfContentImages: 2 })
        .build();

      let images;

      post.contentImages = JSON.stringify(post.contentImages);
      images = Post.parse(post).contentImages;
      isArrayOfLength(images, 2);

      post.contentImages = null;
      images = Post.parse(post).contentImages;
      assert.isNull(images);

      post.contentImages = '';
      images = Post.parse(post).contentImages;
      assert.isNull(images);

      finish();
    });

    it('Collate images', function (finish) {
      const post = new Post()
        .random({ withImage: true, numberOfContentImages: 2 })
        .build();

      let images = Post.collateImages(post);
      isArrayOfLength(images, 3);

      // If main image is null.
      post.image = null;
      images = Post.collateImages(post);
      isArrayOfLength(images, 2);

      finish();
    });
  });
});

const isArrayOfLength = (array, number) => {
  assert.isArray(array);
  assert.lengthOf(array, number);
};
