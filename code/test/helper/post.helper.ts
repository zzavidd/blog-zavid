import {
  createEntity,
  deleteEntity,
  getEntities,
  getSingleEntity,
  SubmitEntityResponse,
  updateEntity
} from '.';
import { assert } from '..';
import { PostDAO } from '../../classes';
import {
  CREATE_POST_QUERY,
  DELETE_POST_QUERY,
  GET_POSTS_QUERY,
  GET_SINGLE_POST_QUERY,
  UPDATE_POST_QUERY
} from '../../src/private/api/queries/post.queries';

const ENTITY_NAME = 'post';

export const getPosts = (variables?: any): Promise<PostDAO[]> => {
  return getEntities({
    query: GET_POSTS_QUERY,
    resolver: 'getAllPosts',
    variables
  });
};

export const getSinglePost = (
  id: number,
  expectToFail?: boolean
): Promise<PostDAO> => {
  return getSingleEntity(id, {
    query: GET_SINGLE_POST_QUERY,
    resolver: 'getSinglePost',
    expectToFail
  });
};

export const submitPost = (post: PostDAO): Promise<SubmitEntityResponse> => {
  return createEntity(post, {
    query: CREATE_POST_QUERY,
    resolver: 'createPost',
    anonym: ENTITY_NAME
  });
};

export const updatePost = (id: number, post: PostDAO): Promise<PostDAO> => {
  return updateEntity(id, post, {
    query: UPDATE_POST_QUERY,
    resolver: 'updatePost',
    anonym: ENTITY_NAME
  });
};

export const deletePost = (id: number): Promise<void> => {
  return deleteEntity(id, {
    query: DELETE_POST_QUERY,
    resolver: 'deletePost',
    verifyDelete: async () => {
      return await getSinglePost(id, true)
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
