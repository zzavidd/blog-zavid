const knex = require('../singleton/knex').getKnex();

/**
 * Retrieves all posts from database.
 * @param {object} args - The arguments.
 * @param {number} args.limit - Defines the number of results to return.
 * @param {object} args.orderBy - Defines which field to use for ordering.
 * @param {boolean} args.random - Indicates if results should be randomly-ordered.
 * @param {string} args.type - The type of post to filter by.
 * @returns {object[]} The posts.
 */
exports.getAllPosts = ({ limit, orderBy, random = false, type }) => {
  let query = knex.select().from('posts');

  if (type) query = query.where('type', type);
  if (random) {
    query = query.orderByRaw('RAND()');
  } else if (orderBy) {
    const { field, order } = orderBy;
    query = query.orderBy(field, order);
  }
  if (limit) query = query.limit(limit);

  return query.then((posts) => posts).catch((err) => console.error(err));
};

/**
 * Retrieves a single post given a specified ID from the database.
 * @param {object} args - The arguments.
 * @param {number} args.id - The ID of the post to retrieve.
 * @returns {object} The post matching the specified ID.
 */
exports.getSinglePost = ({ id }) => {
  return knex
    .select()
    .from('posts')
    .where('id', id)
    .then(([post]) => post)
    .catch((err) => console.error(err));
};

/**
 * Inserts a new post into the database.
 * @param {object} args - The arguments.
 * @param {object} args.post - The post object to be inserted.
 * @param {boolean} args.isPublish - Indicates if a publish operation..
 * @returns {number} The ID of the newly-created post.
 */
exports.createPost = ({ post, isPublish }) => {
  return knex
    .insert(post)
    .into('posts')
    .then(([id]) => ({ id }))
    .catch((err) => console.error(err));
};

/**
 * Updates the fields of a post into the database.
 * @param {object} args - The arguments.
 * @param {number} args.id - The ID of the post to update.
 * @param {object} args.post - The post object to be updated.
 * @returns {object} The post after being updated.
 */
exports.updatePost = ({ id, post }) => {
  return knex('posts')
    .update(post)
    .where('id', id)
    .then(() => this.getSinglePost({ id }))
    .catch((err) => console.error(err));
};

/**
 * Deletes a post from the database.
 * @param {object} args - The arguments.
 * @param {number} args.id - The ID of the post to delete.
 * @returns {number} The ID of the deleted post.
 */
exports.deletePost = ({ id }) => {
  return knex('posts')
    .where('id', id)
    .del()
    .then(() => ({ id }));
};
