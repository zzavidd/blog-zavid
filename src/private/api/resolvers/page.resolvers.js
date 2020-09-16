const { PageQueryBuilder, PageMutationBuilder } = require('../../../classes');
const { debug, ERRORS } = require('../../error');
const knex = require('../../singleton').getKnex();

const ENTITY_NAME = 'page';

/**
 * Retrieves all pages from database.
 * @returns {object[]} The posts.
 */
const getAllPages = () => {
  return Promise.resolve()
    .then(() => new PageQueryBuilder(knex).build())
    .then((pages) => pages)
    .catch(debug);
};

/**
 * Retrieves a single page from database.
 * @param {object} parent Return value of the parent field.
 * @param {object} args The arguments.
 * @param {number} args.id The ID of the page.
 * @returns {object[]} The posts.
 */
const getSinglePage = (parent, { id }) => {
  return Promise.resolve()
    .then(() => new PageQueryBuilder(knex).whereId(id).build())
    .then(([page]) => {
      if (!page) throw ERRORS.NONEXISTENT_ID(id, ENTITY_NAME);
      return page;
    })
    .catch(debug);
};

/**
 * Inserts a new page into the database.
 * @param {object} parent Return value of the parent field.
 * @param {object} args - The arguments.
 * @param {object} args.page - The page object to be inserted.
 * @returns {number} The ID of the newly-created post.
 */
const createPage = (parent, { page }) => {
  return Promise.resolve()
    .then(() => new PageMutationBuilder(knex).insert(page).build())
    .then(([id]) => ({ id }))
    .catch(debug);
};

/**
 * Updates the fields of a page in the database.
 * @param {object} parent Return value of the parent field.
 * @param {object} args - The arguments.
 * @param {number} args.id - The ID of the page to update.
 * @param {object} args.page - The page object to be updated.
 * @returns {object} The page after being updated.
 */
const updatePage = (parent, { id, page }) => {
  return Promise.resolve()
    .then(() => new PageMutationBuilder(knex).update(page).whereId(id).build())
    .then(() => getSinglePage(undefined, { id }))
    .catch(debug);
};

/**
 * Deletes a page from the database.
 * @param {object} parent Return value of the parent field.
 * @param {object} args - The arguments.
 * @param {number} args.id - The ID of the page to delete.
 * @returns {number} The ID of the deleted page.
 */
const deletePage = (parent, { id }) => {
  return Promise.resolve()
    .then(() => new PageQueryBuilder(knex).whereId(id).build())
    .then(([page]) => {
      if (!page) throw ERRORS.NONEXISTENT_ID(id, ENTITY_NAME);
      return new PageMutationBuilder(knex).delete(id).build();
    })
    .then(() => ({ id }))
    .catch(debug);
};

module.exports = {
  Query: {
    pages: getAllPages,
    page: getSinglePage
  },
  Mutation: {
    createPage,
    updatePage,
    deletePage
  }
};
