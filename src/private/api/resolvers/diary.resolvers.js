const { debug } = require('../../error');
const knex = require('../../singleton').getKnex();

/**
 * Retrieves all diary entries from database.
 * @param {object} parent Return value of the parent field.
 * @param {object} args The arguments.
 * @returns {object[]} The posts.
 */
const getAllDiaryEntries = (parent, args) => {
  return Promise.resolve()
    .then(() => knex.select().from('diary'))
    .then((diaryEntries) => diaryEntries)
    .catch(debug);
};

module.exports = {
  Query: {
    diaryEntries: getAllDiaryEntries
  }
};
