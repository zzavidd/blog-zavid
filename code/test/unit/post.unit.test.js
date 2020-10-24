const { assert } = require('..');
const { Post, PostBuilder } = require('../../classes');

describe('Unit Tests: Post', function () {
  describe('Object methods', function () {
    it('Test random construction', function (finish) {
      const post = new PostBuilder().random({ numberOfContentImages: 4 }).build();
      isArrayOfLength(post.contentImages, 4);
      finish();
    });
  });

  describe('Static methods', function () {
    it('Check post type', function (finish) {
      const reverie = new PostBuilder()
        .random()
        .withType(Post.TYPES.REVERIE.TITLE)
        .build();
      assert.isTrue(Post.isReverie(reverie));
      assert.isTrue(Post.isReverie(reverie.type));

      const page = new PostBuilder().random().withType(Post.TYPES.PAGE.TITLE).build();
      assert.isTrue(Post.isPage(page));
      assert.isTrue(Post.isPage(page.type));
      finish();
    });

    it('Check post status', function (finish) {
      const draftPost = new PostBuilder()
        .random()
        .withStatus(Post.STATUSES.DRAFT)
        .build();
      assert.isTrue(Post.isDraft(draftPost));
      assert.isTrue(Post.isDraft(draftPost.status));

      const privatePost = new PostBuilder()
        .random()
        .withStatus(Post.STATUSES.PRIVATE)
        .build();
      assert.isTrue(Post.isPrivate(privatePost));
      assert.isTrue(Post.isPrivate(privatePost.status));

      const publishPost = new PostBuilder()
        .random()
        .withStatus(Post.STATUSES.PUBLISHED)
        .build();
      assert.isTrue(Post.isPublish(publishPost));
      assert.isTrue(Post.isPublish(publishPost.status));
      finish();
    });

    it('Parse post', function (finish) {
      const post = new PostBuilder()
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
      const post = new PostBuilder()
        .random({ withImage: true, numberOfContentImages: 2 })
        .build();

      let images = Post.collateImages(post);
      isArrayOfLength(images, 3);

      // If main image is null.
      post.image = null;
      images = Post.collateImages(post);
      isArrayOfLength(images, 2);

      images = Post.collateImages(post, { includeNulls: true });
      isArrayOfLength(images, 3);

      finish();
    });
  });
});

const isArrayOfLength = (array, number) => {
  assert.isArray(array);
  assert.lengthOf(array, number);
};
