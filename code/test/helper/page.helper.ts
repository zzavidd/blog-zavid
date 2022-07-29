import {
  createEntity,
  deleteEntity,
  getEntities,
  getSingleEntity,
  SubmitEntityResponse,
  updateEntity,
} from '.';
import { assert, Variables } from '..';
import { PageDAO } from '../../classes';
import {
  CREATE_PAGE_QUERY,
  DELETE_PAGE_QUERY,
  GET_PAGES_QUERY,
  GET_SINGLE_PAGE_QUERY,
  UPDATE_PAGE_QUERY,
} from '../../src/private/api/queries/page.queries';

const ENTITY_NAME = 'page';

export const getPages = (variables?: Variables): Promise<PageDAO[]> => {
  return getEntities({
    query: GET_PAGES_QUERY,
    resolver: 'pages',
    variables,
  }) as Promise<PageDAO[]>;
};

export const getSinglePage = (
  id: number,
  expectToFail?: boolean,
): Promise<PageDAO> => {
  return getSingleEntity(id, {
    query: GET_SINGLE_PAGE_QUERY,
    resolver: 'page',
    expectToFail,
  }) as Promise<PageDAO>;
};

export const createPage = (page: PageDAO): Promise<SubmitEntityResponse> => {
  return createEntity(page, {
    query: CREATE_PAGE_QUERY,
    resolver: 'createPage',
    anonym: ENTITY_NAME,
  }) as Promise<SubmitEntityResponse>;
};

export const updatePage = (id: number, page: PageDAO): Promise<PageDAO> => {
  return updateEntity(id, page, {
    query: UPDATE_PAGE_QUERY,
    resolver: 'updatePage',
    anonym: ENTITY_NAME,
  }) as Promise<PageDAO>;
};

export const deletePage = (id: number): Promise<void> => {
  return deleteEntity(id, {
    query: DELETE_PAGE_QUERY,
    resolver: 'deletePage',
    verifyDelete: async () => await getSinglePage(id, true),
  });
};

export const comparePages = (request: PageDAO, response: PageDAO) => {
  assert.strictEqual(request.title, response.title);
  assert.strictEqual(request.content, response.content);
  assert.strictEqual(request.excerpt, response.excerpt);
  assert.deepStrictEqual(request.isEmbed, response.isEmbed);
};
