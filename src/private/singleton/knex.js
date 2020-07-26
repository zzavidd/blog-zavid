const assert = require('assert');

let IKnex;

/**
 * Set the instance of the Knex database controller.
 * @param {object} instance - The Knex instance.
 */
exports.setKnex = (instance) => {
  IKnex = instance;
  console.info('Connected to database.');
};

/**
 * Retrieve the Knex singleton instance.
 * @returns {object} The Knex instance.
 */
exports.getKnex = () => {
  assert.ok(IKnex, 'Knex has not been initialized.');
  return IKnex;
};
