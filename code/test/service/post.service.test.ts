import { assert, promiseWrapper, testWrapper } from '..';
import { PostBuilder, PostStatic, PostStatus, PostType } from '../../classes';
import { extractPublicId, retrieveResource } from '../helper';
import {
  comparePosts,
  deletePost,
  getPosts,
  getSinglePost,
  createPost,
  updatePost
} from '../helper/post.helper';

describe('Service Tests: Post', function () {
  describe('Get All Posts', function () {
    it(
      'All',
      testWrapper(async () => {
        const posts = await getPosts();
        assert.isOk(posts);
      })
    );

    it(
      'With limit',
      testWrapper(async () => {
        const limit = 5;
        const posts = await getPosts({ limit: 5 });
        assert.lengthOf(posts, limit);
      })
    );

    it(
      'Including types',
      testWrapper(async () => {
        const includedTypes = [PostType.REVERIE, PostType.EPISTLE];
        const excludedTypes = PostStatic.TYPES.filter((val) => {
          return includedTypes.indexOf(val) == -1;
        });

        const posts = await getPosts({ type: { include: includedTypes } });
        posts.forEach((post) => {
          assert.include(includedTypes, post.type);
          assert.notInclude(excludedTypes, post.type);
        });
      })
    );

    it(
      'Excluding types',
      testWrapper(async () => {
        const excludedTypes = [PostType.REVERIE, PostType.EPISTLE];
        const includedTypes = PostStatic.TYPES.filter(function (val) {
          return excludedTypes.indexOf(val) == -1;
        });

        const posts = await getPosts({ type: { exclude: excludedTypes } });

        posts.forEach((post) => {
          assert.include(includedTypes, post.type);
          assert.notInclude(excludedTypes, post.type);
        });
      })
    );
  });

  describe('Create Post', function () {
    it(
      'Without image',
      testWrapper(async () => {
        const postToCreate = new PostBuilder()
          .random({ allowPageTypes: false })
          .build();
        const createdPost = await createPost(postToCreate);
        const readPost = await getSinglePost(createdPost.id);

        comparePosts(postToCreate, readPost);
        await deletePost(readPost.id!);
      })
    );

    it(
      'With image',
      testWrapper(async () => {
        const post = new PostBuilder()
          .random({
            allowPageTypes: false,
            withImage: true,
            numberOfContentImages: 2
          })
          .build();

        const createdPost = await createPost(post);
        const readPost = await getSinglePost(createdPost.id);

        const postId = readPost.id!;
        const publicId = extractPublicId(readPost.image as string);

        const resources = await retrieveResource(publicId);
        assert.isNotEmpty(resources);
        assert.strictEqual(resources[0].public_id, publicId);
        await deletePost(postId);
      })
    );

    it('Different statuses', function () {
      const promiseDraft = createPostStatusPromise(PostStatus.DRAFT, {
        expectNullSlug: true,
        failMessage: 'A slug was incorrectly generated for this DRAFT post.'
      });

      const promiseProtected = createPostStatusPromise(PostStatus.PROTECTED, {
        failMessage:
          'A slug should have been generated for this PROTECTED post.'
      });

      const promisePrivate = createPostStatusPromise(PostStatus.PRIVATE, {
        failMessage: 'A slug should have been generated for this PRIVATE post.'
      });

      const promisePublished = createPostStatusPromise(PostStatus.PUBLISHED, {
        failMessage:
          'A slug should have been generated for this PUBLISHED post.'
      });

      return Promise.all([
        promiseDraft,
        promiseProtected,
        promisePrivate,
        promisePublished
      ]);
    });
  });

  describe('Update Post', function () {
    it(
      'Without image',
      testWrapper(async () => {
        const postToSubmit = new PostBuilder()
          .random({ allowPageTypes: false })
          .build();
        const postForUpdate = new PostBuilder()
          .random({ allowPageTypes: false })
          .build();
        const createdPost = await createPost(postToSubmit);
        const updatedPost = await updatePost(createdPost.id, postForUpdate);

        comparePosts(postForUpdate, updatedPost);
        assert.strictEqual(createdPost.id, updatedPost.id);
        await deletePost(createdPost.id);
      })
    );

    it(
      'With images',
      testWrapper(async () => {
        const postToSubmit = new PostBuilder()
          .random({
            allowPageTypes: false,
            withImage: true,
            numberOfContentImages: 2
          })
          .build();
        const postForUpdate = new PostBuilder()
          .random({
            allowPageTypes: false,
            withImage: true,
            numberOfContentImages: 2
          })
          .build();

        const createdPost = await createPost(postToSubmit);
        const readPost = await getSinglePost(createdPost.id);

        const postId = createdPost.id;
        const publicIdSubmit = extractPublicId(readPost.image as string);

        const updatedPost = await updatePost(postId, postForUpdate);
        const publicIdUpdate = extractPublicId(updatedPost.image as string);
        assert.notEqual(publicIdSubmit, publicIdUpdate);
        await deletePost(postId);
      })
    );
  });
});

async function createPostStatusPromise(
  status: PostStatus,
  options: CreatePromiseOptions
) {
  const { failMessage, expectNullSlug = false } = options;
  return promiseWrapper(async () => {
    const draftPost = new PostBuilder()
      .random({ allowPageTypes: false })
      .withStatus(status)
      .build();
    const createdPost = await createPost(draftPost);
    const readPost = await getSinglePost(createdPost.id);

    const slug = readPost.slug!;
    if (expectNullSlug) {
      assert.isNull(slug, failMessage);
    } else {
      assert.isNotNull(slug, failMessage);
    }

    await deletePost(readPost.id!);
  });
}

type CreatePromiseOptions = {
  failMessage: string;
  expectNullSlug?: boolean;
};
