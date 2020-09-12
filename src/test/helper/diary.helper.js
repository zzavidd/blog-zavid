const { assert, fetch } = require('..');
const { Diary } = require('../../classes');
const {
  GET_SINGLE_DIARY_QUERY,
  CREATE_DIARY_QUERY,
  UPDATE_DIARY_QUERY,
  DELETE_DIARY_QUERY
} = require('../../private/api/queries/diary.queries');

/**
 * Submits a diary entry to the server.
 * @param {object} diaryEntry The diary entry to submit.
 * @param {Function} [assertions] The assertions to make.
 * @returns {Promise} A resolution of the Promise.
 */
exports.submitDiaryEntry = (diaryEntry, assertions) => {
  return Promise.resolve()
    .then(() => {
      // Submit the random diaryentry.
      return fetch(
        CREATE_DIARY_QUERY,
        { variables: { diaryEntry } },
        function ({ data }) {
          const createdDiaryEntry = data.createDiaryEntry;
          assert.hasAnyKeys(createdDiaryEntry, 'id');
          return createdDiaryEntry;
        }
      );
    })
    .then((createdDiaryEntry) => {
      // Retrieve the diary entry and run comparison.
      return fetch(
        GET_SINGLE_DIARY_QUERY,
        { variables: { id: createdDiaryEntry.id } },
        function ({ data }) {
          const returnedDiaryEntry = data.diaryEntry;
          if (assertions) assertions(returnedDiaryEntry);
          return returnedDiaryEntry.id;
        }
      );
    });
};

/**
 * Updates a diary entry on the server.
 * @param {number} id The ID of the diary entry to update.
 * @param {object} diaryEntry The diary entry to update.
 * @param {Function} [assertions] The assertions to make.
 * @returns {Promise} A resolution of the Promise.
 */
exports.updateDiaryEntry = (id, diaryEntry, assertions) => {
  return fetch(
    UPDATE_DIARY_QUERY,
    { variables: { id, diaryEntry, isTest: true } },
    function ({ data }) {
      const updatedDiaryEntry = data.updateDiaryEntry;
      assert.strictEqual(updatedDiaryEntry.id, id);
      if (assertions) assertions(updatedDiaryEntry);
    }
  );
};

/**
 * Deletes a diary entry from the server.
 * @param {number} id The ID of the diary entry to delete.
 * @param {Function} [assertions] The assertions to make.
 * @returns {Promise} A resolution of the Promise.
 */
exports.deleteDiaryEntry = (id, assertions) => {
  return Promise.resolve()
    .then(() => {
      // Delete the diary entry.
      return fetch(DELETE_DIARY_QUERY, { variables: { id } }, function ({
        data
      }) {
        const deletedDiaryEntry = data.deleteDiaryEntry;
        assert.property(deletedDiaryEntry, 'id');
      });
    })
    .then(() => {
      // Attempt to retrieve diary entry and expect failure.
      return fetch(
        GET_SINGLE_DIARY_QUERY,
        { variables: { id }, expectToFail: true },
        function ({ errors }) {
          assert.isOk(errors);
          if (assertions) assertions();
        }
      );
    });
};

/**
 * Compares to diary entry objects.
 * @param {object} request The diary entry submitted from client.
 * @param {object} response The diary entry returned from server.
 */
exports.compareDiaryEntries = (request, response) => {
  assert.strictEqual(request.content, response.content);
  assert.strictEqual(request.status, response.status);
  assert.strictEqual(Diary.generateSlug(request), response.slug);
  assert.strictEqual(
    new Date(request.date).getUTCMilliseconds,
    new Date(parseInt(response.date)).getUTCMilliseconds
  );
};
