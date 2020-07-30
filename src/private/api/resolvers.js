const knex = require('../singleton/knex').getKnex();

/**
 * Retrieves all posts from database.
 * @param {object} args - The arguments.
 * @param {number} args.limit - Defines the number of results to return.
 * @param {number} args.random - Indicates if results should be randomly-ordered.
 * @param {number} args.type - The type of post to filter by.
 * @returns {object[]} The posts.
 */
exports.getAllPosts = ({ limit, random = false, type }) => {
  let query = knex.select().from('posts');
  if (type) query = query.where('type', type);
  if (random) query = query.orderByRaw('RAND()');
  if (limit) query = query.limit(limit);
  return query.then((posts) => posts);
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
    .catch((err) => console.log(err));
};

/**
 * Inserts a new post into the database.
 * @param {object} args - The arguments.
 * @param {object} args.post - The post object to be inserted.
 * @returns {number} The ID of the newly-created post.
 */
exports.createPost = ({ post }) => {
  return knex
    .insert(post)
    .into('posts')
    .then(([id]) => ({ id }));
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
    .then(() => resolvers.getSinglePost({ id }))
    .catch((err) => console.log(err));
};

/**
 * Deletes a post from the database.
 * @param {object} args - The arguments.
 * @param {number} args.id - The ID of the post to delete.
 */
exports.deletePost = ({ id }) => {
  return knex('posts').where('id', id).del();
};
