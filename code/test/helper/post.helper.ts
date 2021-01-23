import {
  createEntity,
  deleteEntity,
  getEntities,
  getSingleEntity,
  SubmitEntityResponse,
  updateEntity
} from '.';
import { assert, Variables } from '..';
import { PostDAO } from '../../classes';
import {
  CREATE_POST_QUERY,
  DELETE_POST_QUERY,
  GET_POSTS_QUERY,
  GET_SINGLE_POST_QUERY,
  UPDATE_POST_QUERY
} from '../../src/private/api/queries/post.queries';

const ENTITY_NAME = 'post';

export const getPosts = (variables?: Variables): Promise<PostDAO[]> => {
  return getEntities({
    query: GET_POSTS_QUERY,
    resolver: 'getAllPosts',
    variables
  }) as Promise<PostDAO[]>;
};

export const getSinglePost = (
  id: number,
  expectToFail?: boolean
): Promise<PostDAO> => {
  return getSingleEntity(id, {
    query: GET_SINGLE_POST_QUERY,
    resolver: 'getSinglePost',
    expectToFail
  }) as Promise<PostDAO>;
};

export const createPost = (
  post: PostDAO,
  options: MutatePostOptions = {}
): Promise<SubmitEntityResponse> => {
  const { extraVariables } = options;
  return createEntity(post, {
    query: CREATE_POST_QUERY,
    resolver: 'createPost',
    anonym: ENTITY_NAME,
    extraVariables
  }) as Promise<SubmitEntityResponse>;
};

export const updatePost = (
  id: number,
  post: PostDAO,
  options: MutatePostOptions = {}
): Promise<PostDAO> => {
  const { extraVariables } = options;
  return updateEntity(id, post, {
    query: UPDATE_POST_QUERY,
    resolver: 'updatePost',
    anonym: ENTITY_NAME,
    extraVariables
  }) as Promise<PostDAO>;
};

export const deletePost = (id: number): Promise<void> => {
  return deleteEntity(id, {
    query: DELETE_POST_QUERY,
    resolver: 'deletePost',
    verifyDelete: async () => await getSinglePost(id, true)
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

type MutatePostOptions = {
  extraVariables?: Record<string, unknown>;
};
