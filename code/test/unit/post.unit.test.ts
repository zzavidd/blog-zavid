const { assert, classes } = require('..');
const { PostStatic, PostBuilder } = classes;

describe('Unit Tests: PostStatic', function () {
  describe('Object methods', function () {
    it('Test random construction', function (finish) {
      const post = new PostBuilder()
        .random({ numberOfContentImages: 4 })
        .build();
      isArrayOfLength(post.contentImages, 4);
      finish();
    });
  });

  describe('Static methods', function () {
    it('Check post type', function (finish) {
      const reverie = new PostBuilder()
        .random()
        .withType(PostStatic.TYPE.REVERIE)
        .build();
      assert.isTrue(PostStatic.isReverie(reverie));

      const page = new PostBuilder()
        .random()
        .withType(PostStatic.TYPE.PAGE)
        .build();
      assert.isTrue(PostStatic.isPage(page));
      assert.isTrue(PostStatic.isPage(page));
      finish();
    });

    it('Check post status', function (finish) {
      const draftPost = new PostBuilder()
        .random()
        .withStatus(PostStatic.STATUS.DRAFT)
        .build();
      assert.isTrue(PostStatic.isDraft(draftPost));

      const privatePost = new PostBuilder()
        .random()
        .withStatus(PostStatic.STATUS.PRIVATE)
        .build();
      assert.isTrue(PostStatic.isPrivate(privatePost));
      assert.isTrue(PostStatic.isPrivate(privatePost));

      const publishPost = new PostBuilder()
        .random()
        .withStatus(PostStatic.STATUS.PUBLISHED)
        .build();
      assert.isTrue(PostStatic.isPublish(publishPost));
      finish();
    });

    it('Parse post', function (finish) {
      const post = new PostBuilder()
        .random({ withImage: true, numberOfContentImages: 2 })
        .build();

      let images;

      post.contentImages = JSON.stringify(post.contentImages);
      images = PostStatic.parse(post).contentImages;
      isArrayOfLength(images, 2);

      post.contentImages = null;
      images = PostStatic.parse(post).contentImages;
      assert.isNull(images);

      post.contentImages = '';
      images = PostStatic.parse(post).contentImages;
      assert.isNull(images);

      finish();
    });

    it('Collate images', function (finish) {
      const post = new PostBuilder()
        .random({ withImage: true, numberOfContentImages: 2 })
        .build();

      let images = PostStatic.collateImages(post);
      isArrayOfLength(images, 3);

      // If main image is null.
      post.image = null;
      images = PostStatic.collateImages(post);
      isArrayOfLength(images, 2);

      images = PostStatic.collateImages(post, { includeNulls: true });
      isArrayOfLength(images, 3);

      finish();
    });
  });
});

const isArrayOfLength = (array: any[], number: number): void => {
  assert.isArray(array);
  assert.lengthOf(array, number);
};
