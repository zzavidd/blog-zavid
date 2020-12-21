import {
  createEntity,
  deleteEntity,
  getEntities,
  getSingleEntity,
  SubmitEntityResponse,
  updateEntity
} from '.';
import { assert, Variables } from '..';
import { DiaryDAO, DiaryStatic } from '../../classes';
import {
  CREATE_DIARY_QUERY,
  DELETE_DIARY_QUERY,
  GET_DIARY_QUERY,
  GET_SINGLE_DIARY_QUERY,
  UPDATE_DIARY_QUERY
} from '../../src/private/api/queries/diary.queries';

const ENTITY_NAME = 'diaryEntry';

export const getDiaryEntries = (variables?: Variables) => {
  return getEntities<DiaryDAO>({
    query: GET_DIARY_QUERY,
    resolver: 'diaryEntries',
    variables
  });
};

export const getSingleDiaryEntry = (
  id: number,
  expectToFail?: boolean
): Promise<DiaryDAO> => {
  return getSingleEntity(id, {
    query: GET_SINGLE_DIARY_QUERY,
    resolver: 'diaryEntry',
    expectToFail
  }) as Promise<DiaryDAO>;
};

export const createDiaryEntry = (
  diaryEntry: DiaryDAO,
  options: MutateDiaryOptions = {}
): Promise<SubmitEntityResponse> => {
  const { extraVariables } = options;
  return createEntity(diaryEntry, {
    query: CREATE_DIARY_QUERY,
    resolver: 'createDiaryEntry',
    anonym: ENTITY_NAME,
    extraVariables
  }) as Promise<SubmitEntityResponse>;
};

export const updateDiaryEntry = (
  id: number,
  diaryEntry: DiaryDAO,
  options: MutateDiaryOptions = {}
): Promise<DiaryDAO> => {
  const { extraVariables } = options;
  return updateEntity(id, diaryEntry, {
    query: UPDATE_DIARY_QUERY,
    resolver: 'updateDiaryEntry',
    anonym: ENTITY_NAME,
    extraVariables
  }) as Promise<DiaryDAO>;
};

export const deleteDiaryEntry = (id: number): Promise<void> => {
  return deleteEntity(id, {
    query: DELETE_DIARY_QUERY,
    resolver: 'deleteDiaryEntry',
    verifyDelete: async () => await getSingleDiaryEntry(id, true)
  });
};

export const compareDiaryEntries = (
  request: DiaryDAO,
  response: DiaryDAO
): void => {
  assert.strictEqual(request.content, response.content);
  assert.strictEqual(request.status, response.status);
  assert.strictEqual(DiaryStatic.generateSlug(request), response.slug);
  assert.strictEqual(
    new Date(request.date as string).getUTCMilliseconds,
    new Date(parseInt(response.date as string)).getUTCMilliseconds
  );
};

interface MutateDiaryOptions {
  extraVariables?: Record<string, unknown>;
}
