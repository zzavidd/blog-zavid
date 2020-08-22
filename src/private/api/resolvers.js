const { PostQueryBuilder } = require('../../classes/builders/post-query');
const { debug } = require('../error');

const filer = require('../filer');
const knex = require('../singleton/knex').getKnex();

/**
 * Retrieves all posts from database.
 * @param {object} args - The arguments.
 * @param {number} args.limit - Defines the number of results to return.
 * @param {object} args.sort - Defines which field to use for ordering.
 * @param {string} args.type - The type of post to filter by.
 * @returns {object[]} The posts.
 */
exports.getAllPosts = ({ limit, sort, type }) => {
  return Promise.resolve()
    .then(() => {
      return new PostQueryBuilder(knex)
        .whereType(type)
        .withOrder(sort)
        .withLimit(limit)
        .build();
    })
    .then((posts) => posts)
    .catch(debug);
};

/**
 * Retrieves a single post given a specified ID from the database.
 * @param {object} args - The arguments.
 * @param {number} args.id - The ID of the post to retrieve.
 * @returns {object} The post matching the specified ID.
 */
exports.getSinglePost = ({ id }) => {
  return Promise.resolve()
    .then(() => {
      return new PostQueryBuilder(knex).whereId(id).build();
    })
    .then(([post]) => post)
    .catch(debug);
};

/**
 * Inserts a new post into the database.
 * @param {object} args - The arguments.
 * @param {object} args.post - The post object to be inserted.
 * @param {boolean} args.isPublish - Indicates if a publish operation.
 * @returns {number} The ID of the newly-created post.
 */
exports.createPost = ({ post, isPublish }) => {
  return Promise.resolve()
    .then(() => filer.uploadImage(post))
    .then((post) => {
      return knex.insert(post).into('posts');
    })
    .then(([id]) => {
      return { id };
    })
    .catch(debug);
};

/**
 * Updates the fields of a post into the database.
 * @param {object} args - The arguments.
 * @param {number} args.id - The ID of the post to update.
 * @param {object} args.post - The post object to be updated.
 * @param {boolean} args.isPublish - Indicates if a publish operation.
 * @param {boolean} args.imageHasChanged - Indicates if image has changed.
 * @returns {object} The post after being updated.
 */
exports.updatePost = ({ id, post, isPublish, imageHasChanged }) => {
  return Promise.resolve()
    .then(() => filer.replaceImage(id, post, imageHasChanged))
    .then((updatedPost) => {
      return knex('posts').update(updatedPost).where('id', id);
    })
    .then(() => this.getSinglePost({ id }))
    .catch(debug);
};

/**
 * Deletes a post from the database.
 * @param {object} args - The arguments.
 * @param {number} args.id - The ID of the post to delete.
 * @returns {number} The ID of the deleted post.
 */
exports.deletePost = ({ id }) => {
  return Promise.resolve()
    .then(() => {
      return new PostQueryBuilder(knex).whereId(id).build();
    })
    .then(([post]) => {
      return filer.destroyImage(post.image);
    })
    .then(() => {
      return knex('posts')
        .where('id', id)
        .del()
        .then(() => ({ id }));
    })
    .catch(debug);
};
