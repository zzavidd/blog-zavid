import { assert, debug, fetch } from '..';
import { PostDAO } from '../../classes';
import {
  CREATE_POST_QUERY,
  DELETE_POST_QUERY,
  GET_SINGLE_POST_QUERY,
  UPDATE_POST_QUERY
} from '../../src/private/api/queries/post.queries';

export const submitPost = (
  post: PostDAO,
  assertions?: Function,
  isPublish: boolean = false
): Promise<number> => {
  return Promise.resolve()
    .then(() => {
      // Submit the random post.
      return fetch(
        CREATE_POST_QUERY,
        { variables: { post, isPublish, isTest: true } },
        function ({ data }: any) {
          const createdPost = data.createPost;
          assert.property(createdPost, 'id');
          return createdPost;
        }
      );
    })
    .then((createdPost) => {
      // Retrieve the post and run comparison.
      return fetch(
        GET_SINGLE_POST_QUERY,
        { variables: { id: createdPost.id } },
        function ({ data }: any) {
          const returnedPost = data.getSinglePost;
          if (assertions) assertions(returnedPost);
          return returnedPost.id;
        }
      );
    })
    .catch(debug);
};

export const updatePost = (
  id: number,
  post: PostDAO,
  assertions?: Function,
  isPublish: boolean = false
): Promise<PostDAO> => {
  return fetch(
    UPDATE_POST_QUERY,
    { variables: { id, post, isPublish, isTest: true } },
    function ({ data }: any) {
      const updatedPost = data.updatePost;
      assert.strictEqual(updatedPost.id, id);
      if (assertions) assertions(updatedPost);
    }
  );
};

export const deletePost = (
  id: number,
  assertions?: Function
): Promise<number> => {
  return Promise.resolve()
    .then(() => {
      // Delete the post.
      return fetch(DELETE_POST_QUERY, { variables: { id } }, function ({
        data
      }: any) {
        const deletedPost = data.deletePost;
        assert.property(deletedPost, 'id');
      });
    })
    .then(() => {
      // Attempt to retrieve post and expect failure.
      return fetch(
        GET_SINGLE_POST_QUERY,
        { variables: { id }, expectToFail: true },
        function ({ errors }: any) {
          assert.isOk(errors);
          if (assertions) assertions();
        }
      );
    })
    .catch(debug);
};

export const comparePosts = (submission: PostDAO, output: PostDAO) => {
  assert.strictEqual(submission.title, output.title);
  assert.strictEqual(submission.type, output.type);
  assert.strictEqual(submission.content, output.content);
  assert.strictEqual(submission.excerpt, output.excerpt);
  assert.strictEqual(submission.status, output.status);
  assert.strictEqual(
    new Date(submission.datePublished as string).getUTCMilliseconds,
    new Date(parseInt(output.datePublished as string)).getUTCMilliseconds
  );
};
