import { assert, debug, fetch } from '..';
const {
  GET_SINGLE_DIARY_QUERY,
  CREATE_DIARY_QUERY,
  UPDATE_DIARY_QUERY,
  DELETE_DIARY_QUERY
} = require('../../src/private/api/queries/diary.queries');

import { DiaryDAO, DiaryStatic } from '../../classes';

export const submitDiaryEntry = (
  diaryEntry: DiaryDAO,
  assertions?: Function,
  isPublish: boolean = false
): Promise<number> => {
  return Promise.resolve()
    .then(() => {
      // Submit the random diary entry.
      return fetch(
        CREATE_DIARY_QUERY,
        { variables: { diaryEntry, isPublish } },
        function ({ data }: any) {
          const createdDiaryEntry = data.createDiaryEntry;
          assert.property(createdDiaryEntry, 'id');
          return createdDiaryEntry;
        }
      );
    })
    .then((createdDiaryEntry) => {
      // Retrieve the diary entry and run comparison.
      return fetch(
        GET_SINGLE_DIARY_QUERY,
        { variables: { id: createdDiaryEntry.id } },
        function ({ data }: any) {
          const returnedDiaryEntry = data.diaryEntry;
          if (assertions) assertions(returnedDiaryEntry);
          return returnedDiaryEntry.id;
        }
      );
    })
    .catch(debug);
};

export const updateDiaryEntry = (
  id: number,
  diaryEntry: DiaryDAO,
  assertions?: Function,
  isPublish: boolean = false
): Promise<DiaryDAO> => {
  return fetch(
    UPDATE_DIARY_QUERY,
    { variables: { id, diaryEntry, isPublish, isTest: true } },
    function ({ data }: any) {
      const updatedDiaryEntry = data.updateDiaryEntry;
      assert.strictEqual(updatedDiaryEntry.id, id);
      if (assertions) assertions(updatedDiaryEntry);
    }
  );
};

export const deleteDiaryEntry = (
  id: number,
  assertions?: Function
): Promise<number> => {
  return Promise.resolve()
    .then(() => {
      // Delete the diary entry.
      return fetch(DELETE_DIARY_QUERY, { variables: { id } }, function ({
        data
      }: any) {
        const deletedDiaryEntry = data.deleteDiaryEntry;
        assert.property(deletedDiaryEntry, 'id');
      });
    })
    .then(() => {
      // Attempt to retrieve diary entry and expect failure.
      return fetch(
        GET_SINGLE_DIARY_QUERY,
        { variables: { id }, expectToFail: true },
        function ({ errors }: any) {
          assert.isOk(errors);
          if (assertions) assertions();
        }
      );
    })
    .catch(debug);
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
