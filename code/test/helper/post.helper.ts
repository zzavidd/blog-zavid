import { assert, fetch, FetchResponse } from '..';
import { PostDAO } from '../../classes';
import {
  CREATE_POST_QUERY,
  DELETE_POST_QUERY,
  GET_POSTS_QUERY,
  GET_SINGLE_POST_QUERY,
  UPDATE_POST_QUERY
} from '../../src/private/api/queries/post.queries';

interface GetPostsOptions {
  variables?: any;
}

interface GetSinglePostOptions {
  expectToFail?: boolean;
}

interface MutatePostOptions {
  isPublish?: boolean;
}

export interface SubmitPostResponse {
  id: number;
}

export const getPosts = (options: GetPostsOptions = {}): Promise<PostDAO[]> => {
  const { variables = {} } = options;
  return new Promise<PostDAO[]>(async (resolve, reject) => {
    try {
      const { data } = (await fetch(GET_POSTS_QUERY, {
        variables
      })) as FetchResponse;
      const posts = data.getAllPosts as PostDAO[];
      resolve(posts);
    } catch (err) {
      reject(err);
    }
  });
};

export const getSinglePost = (
  id: number,
  options: GetSinglePostOptions = {}
): Promise<PostDAO> => {
  const { expectToFail = false } = options;

  return new Promise<PostDAO>(async (resolve, reject) => {
    try {
      const { data, errors } = (await fetch(GET_SINGLE_POST_QUERY, {
        variables: { id },
        expectToFail
      })) as FetchResponse;

      if (expectToFail) {
        assert.isOk(errors);
        return resolve();
      }

      const post = data.singlePost as PostDAO;
      resolve(post);
    } catch (err) {
      reject(err);
    }
  });
};

export const submitPost = (
  post: PostDAO,
  options: MutatePostOptions = {}
): Promise<SubmitPostResponse> => {
  const { isPublish = false } = options;

  return new Promise<SubmitPostResponse>(async (resolve, reject) => {
    try {
      const { data } = (await fetch(CREATE_POST_QUERY, {
        variables: { post, isPublish, isTest: true }
      })) as FetchResponse;

      const createdPost = data.createPost as SubmitPostResponse;
      assert.property(createdPost, 'id');
      assert.isNumber(createdPost.id);
      resolve(createdPost);
    } catch (err) {
      reject(err);
    }
  });
};

export const updatePost = (
  id: number,
  post: PostDAO,
  options: MutatePostOptions = {}
): Promise<PostDAO> => {
  const { isPublish = false } = options;

  return new Promise<PostDAO>(async (resolve, reject) => {
    try {
      const { data } = (await fetch(UPDATE_POST_QUERY, {
        variables: { id, post, isPublish, isTest: true }
      })) as FetchResponse;

      const updatedPost = data.updatePost as PostDAO;
      assert.strictEqual(updatedPost.id, id);
      resolve(updatedPost);
    } catch (err) {
      reject(err);
    }
  });
};

export const deletePost = (id: number): Promise<void> => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const { data } = (await fetch(DELETE_POST_QUERY, {
        variables: { id }
      })) as FetchResponse;
      const deletedPost = data.deletePost as PostDAO;
      assert.property(deletedPost, 'id');

      await getSinglePost(deletedPost.id!, {
        expectToFail: true
      });
      resolve();
    } catch (err) {
      reject(err);
    }
  });
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
