import { assert } from '..';
import {
  PostBuilder,
  PostImage,
  PostStatic,
  PostStatus,
  PostType
} from '../../classes';

describe('Unit Tests: Post', function () {
  describe('Object methods', function () {
    it('Construct random post object', function (finish) {
      const post = new PostBuilder()
        .random({ numberOfContentImages: 4 })
        .build();
      isArrayOfLength(post.contentImages as PostImage[], 4);
      finish();
    });
  });

  describe('Static methods', function () {
    it('Check post type', function (finish) {
      const reverie = new PostBuilder()
        .random()
        .withType(PostType.REVERIE)
        .build();
      assert.isTrue(PostStatic.isReverie(reverie));

      const page = new PostBuilder().random().withType(PostType.PAGE).build();
      assert.isTrue(PostStatic.isPage(page));
      assert.isTrue(PostStatic.isPage(page));
      finish();
    });

    it('Check post status', function (finish) {
      const draftPost = new PostBuilder()
        .random()
        .withStatus(PostStatus.DRAFT)
        .build();
      assert.isTrue(PostStatic.isDraft(draftPost));

      const privatePost = new PostBuilder()
        .random()
        .withStatus(PostStatus.PRIVATE)
        .build();
      assert.isTrue(PostStatic.isPrivate(privatePost));
      assert.isTrue(PostStatic.isPrivate(privatePost));

      const publishPost = new PostBuilder()
        .random()
        .withStatus(PostStatus.PUBLISHED)
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
      isArrayOfLength(images as PostImage[], 2);

      post.contentImages = null;
      images = PostStatic.parse(post).contentImages;
      assert.isNotOk(images);

      delete post.contentImages;
      images = PostStatic.parse(post).contentImages;
      assert.isNotOk(images);

      finish();
    });

    it('Collate images', function (finish) {
      const post = new PostBuilder()
        .random({ withImage: true, numberOfContentImages: 2 })
        .build();

      let images = PostStatic.collateImages(post) as PostImage[];
      isArrayOfLength(images, 3);

      // If main image is null.
      post.image = null;
      images = PostStatic.collateImages(post) as PostImage[];
      isArrayOfLength(images, 2);

      images = PostStatic.collateImages(post, { includeNulls: true }) as PostImage[];
      isArrayOfLength(images, 3);

      finish();
    });

    it('Random status', function (finish) {
      const randomStatus = PostStatic.randomStatus();
      assert.isTrue(Object.values(PostStatus).includes(randomStatus));
      finish();
    });

    it('Random type', function (finish) {
      const randomType = PostStatic.randomType();
      assert.isTrue(Object.values(PostType).includes(randomType));

      const randomNonPageType = PostStatic.randomType({
        allowPageTypes: false
      });

      assert.notEqual(randomNonPageType, PostType.PAGE);
      finish();
    });
  });
});

const isArrayOfLength = (array: PostImage[], number: number): void => {
  assert.isArray(array);
  assert.lengthOf(array, number);
};
