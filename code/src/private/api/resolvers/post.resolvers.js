const {
  PostStatic,
  PostQueryBuilder,
  PostMutationBuilder
} = require('../../lib').classes;
const { reject } = require('async');
const emails = require('../../emails');
const { debug, ERRORS } = require('../../error');
const filer = require('../../filer');
const knex = require('../../singleton').getKnex();

const { emailsOn } = require('./common');

const ENTITY_NAME = 'post';

/**
 * Retrieves all posts from database.
 * @param {object} parent Return value of the parent field.
 * @param {object} args The arguments.
 * @param {number} args.limit Defines the number of results to return.
 * @param {object} args.sort Defines how to order the results.
 * @param {object} args.type The types to filter by.
 * @param {object} args.status The statuses to filter by.
 * @returns {object[]} The posts.
 */
const getAllPosts = (parent, { limit, sort, type, status }) => {
  return Promise.resolve()
    .then(() =>
      new PostQueryBuilder(knex)
        .whereType(type)
        .whereStatus(status)
        .withOrder(sort, { forStringsWithNumbers: true })
        .withLimit(limit)
        .build()
    )
    .then((posts) => {
      return posts.map((post) => PostStatic.parse(post));
    })
    .catch(debug);
};

/**
 * Retrieves a single post given a specified ID from the database.
 * @param {object} parent Return value of the parent field.
 * @param {object} args - The arguments.
 * @param {number} args.id - The ID of the post to retrieve.
 * @returns {object} The post matching the specified ID.
 */
const getSinglePost = async (parent, { id }) => {
  try {
    const post = await new PostQueryBuilder(knex).whereId(id).build();
    return new Promise((resolve, reject) => {
      if (!post) reject(ERRORS.NONEXISTENT_ID(id, ENTITY_NAME));
      const parsedPost = PostStatic.parse(post);
      resolve(parsedPost);
    });
  } catch (err) {
    reject(err);
  }
};

/**
 * Inserts a new post into the database.
 * @param {object} parent Return value of the parent field.
 * @param {object} args - The arguments.
 * @param {object} args.post - The post object to be inserted.
 * @param {boolean} args.isPublish - Indicates if a publish operation.
 * @param {boolean} args.isTest - Indicates if testing.
 * @returns {number} The ID of the newly-created post.
 */
// eslint-disable-next-line no-unused-vars
const createPost = (parent, { post, isPublish, isTest }) => {
  return Promise.resolve()
    .then(() => filer.uploadImages(post, { isTest }))
    .then((post) => {
      const shouldNotify = isPublish && !PostStatic.isPage(post) && emailsOn;
      return Promise.all([
        new PostMutationBuilder(knex).insert(post).build(),
        shouldNotify ? emails.notifyNewPost(post) : null
      ]);
    })
    .then(([[id]]) => {
      return { id };
    })
    .catch(debug);
};

/**
 * Updates the fields of a post in the database.
 * @param {object} parent Return value of the parent field.
 * @param {object} args - The arguments.
 * @param {number} args.id - The ID of the post to update.
 * @param {object} args.post - The post object to be updated.
 * @param {boolean} args.isPublish - Indicates if a publish operation.
 * @param {boolean} args.isTest - Indicates if testing.
 * @returns {object} The post after being updated.
 */
// eslint-disable-next-line no-unused-vars
const updatePost = (parent, { id, post, isPublish, isTest }) => {
  return Promise.resolve()
    .then(() => filer.replaceImages(id, post, { isTest }))
    .then((updatedPost) => {
      const shouldNotify = isPublish && !PostStatic.isPage(post) && emailsOn;
      return Promise.all([
        new PostMutationBuilder(knex).update(updatedPost).whereId(id).build(),
        shouldNotify ? emails.notifyNewPost(updatedPost) : null
      ]);
    })
    .then(() => getSinglePost(undefined, { id }))
    .catch(debug);
};

/**
 * Deletes a post from the database.
 * @param {object} parent Return value of the parent field.
 * @param {object} args - The arguments.
 * @param {number} args.id - The ID of the post to delete.
 * @returns {number} The ID of the deleted post.
 */
const deletePost = (parent, { id }) => {
  return Promise.resolve()
    .then(() => new PostQueryBuilder(knex).whereId(id).build())
    .then(([post]) => {
      if (!post) throw ERRORS.NONEXISTENT_ID(id, ENTITY_NAME);

      const promises = [];
      const images = PostStatic.collateImages(post);
      images.forEach((image) => {
        promises.push(filer.destroyImage(image));
      });
      return Promise.all(promises);
    })
    .then(() => new PostMutationBuilder(knex).delete(id).build())
    .then(() => ({ id }))
    .catch(debug);
};

const truncatePostTable = () => {
  Promise.resolve()
    .then(() => new PostMutationBuilder(knex).truncate().build())
    .catch(debug);
};

module.exports = {
  Query: {
    getAllPosts,
    getSinglePost
  },
  Mutation: {
    createPost,
    updatePost,
    deletePost,
    truncatePostTable
  }
};
