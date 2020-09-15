const {
  Diary,
  DiaryQueryBuilder,
  DiaryMutationBuilder
} = require('../../../classes');
const emails = require('../../emails');
const { debug, ERRORS } = require('../../error');
const knex = require('../../singleton').getKnex();

const { emailsOn } = require('./common');

const ENTITY_NAME = 'diary entry';

/**
 * Retrieves all diary entries from database.
 * @param {object} parent Return value of the parent field.
 * @param {object} args The arguments.
 * @param {object} args.status The status to filter diary entries by.
 * @returns {object[]} The posts.
 */
const getAllDiaryEntries = (parent, { status }) => {
  return Promise.resolve()
    .then(() => new DiaryQueryBuilder(knex).whereStatus(status).build())
    .then((diaryEntries) => diaryEntries)
    .catch(debug);
};

/**
 * Retrieves a single diary entry from database.
 * @param {object} parent Return value of the parent field.
 * @param {object} args The arguments.
 * @param {number} args.id The ID of the entry.
 * @returns {object[]} The posts.
 */
const getSingleDiaryEntry = (parent, { id }) => {
  return Promise.resolve()
    .then(() => new DiaryQueryBuilder(knex).whereId(id).build())
    .then(([diaryEntry]) => {
      if (!diaryEntry) throw ERRORS.NONEXISTENT_ID(id, ENTITY_NAME);
      return diaryEntry;
    })
    .catch(debug);
};

/**
 * Inserts a new diary entry into the database.
 * @param {object} parent Return value of the parent field.
 * @param {object} args - The arguments.
 * @param {object} args.diaryEntry - The diary entry object to be inserted.
 * @param {boolean} args.isPublish - Indicates if a publish operation.
 * @returns {number} The ID of the newly-created post.
 */
const createDiaryEntry = (parent, { diaryEntry, isPublish }) => {
  return Promise.resolve()
    .then(() => {
      diaryEntry.slug = Diary.generateSlug(diaryEntry);
      return Promise.all([
        new DiaryMutationBuilder(knex).insert(diaryEntry).build(),
        isPublish && emailsOn ? emails.notifyNewDiaryEntry(diaryEntry) : null
      ]);
    })
    .then(([id]) => ({ id }))
    .catch(debug);
};

/**
 * Updates the fields of a diary entry in the database.
 * @param {object} parent Return value of the parent field.
 * @param {object} args - The arguments.
 * @param {number} args.id - The ID of the diary entry to update.
 * @param {object} args.diaryEntry - The diary entry object to be updated.
 * @param {boolean} args.isPublish - Indicates if a publish operation.
 * @returns {object} The diary entry after being updated.
 */
const updateDiaryEntry = (parent, { id, diaryEntry, isPublish }) => {
  return Promise.resolve()
    .then(() => {
      diaryEntry.slug = Diary.generateSlug(diaryEntry);
      return Promise.all([
        new DiaryMutationBuilder(knex).update(diaryEntry).whereId(id).build(),
        isPublish && emailsOn ? emails.notifyNewDiaryEntry(diaryEntry) : null
      ]);
    })
    .then(() => getSingleDiaryEntry(undefined, { id }))
    .catch(debug);
};

/**
 * Deletes a diary entry from the database.
 * @param {object} parent Return value of the parent field.
 * @param {object} args - The arguments.
 * @param {number} args.id - The ID of the diary entry to delete.
 * @returns {number} The ID of the deleted diary entry.
 */
const deleteDiaryEntry = (parent, { id }) => {
  return Promise.resolve()
    .then(() => new DiaryQueryBuilder(knex).whereId(id).build())
    .then(([diaryEntry]) => {
      if (!diaryEntry) throw ERRORS.NONEXISTENT_ID(id, ENTITY_NAME);
      return new DiaryMutationBuilder(knex).delete(id).build();
    })
    .then(() => ({ id }))
    .catch(debug);
};

module.exports = {
  Query: {
    diaryEntries: getAllDiaryEntries,
    diaryEntry: getSingleDiaryEntry
  },
  Mutation: {
    createDiaryEntry,
    updateDiaryEntry,
    deleteDiaryEntry
  }
};
