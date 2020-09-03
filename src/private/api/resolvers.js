const {
  Post,
  PostQueryBuilder,
  PostMutationBuilder
} = require('../../classes');
const { debug, ERRORS } = require('../error');
const filer = require('../filer');
const knex = require('../singleton').getKnex();

/**
 * Retrieves all posts from database.
 * @param {object} args The arguments.
 * @param {number} args.limit Defines the number of results to return.
 * @param {object} args.sort Defines how to order the results.
 * @param {object} args.type The types to filter by.
 * @param {object} args.status The statuses to filter by.
 * @returns {object[]} The posts.
 */
exports.getAllPosts = ({ limit, sort, type, status }) => {
  return Promise.resolve()
    .then(() =>
      new PostQueryBuilder(knex)
        .whereType(type)
        .whereStatus(status)
        .withOrder(sort)
        .withLimit(limit)
        .build()
    )
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
    .then(() => new PostQueryBuilder(knex).whereId(id).build())
    .then(([post]) => {
      if (!post) throw ERRORS.NO_POST_WITH_ID(id);
      return post;
    })
    .catch(debug);
};

/**
 * Inserts a new post into the database.
 * @param {object} args - The arguments.
 * @param {object} args.post - The post object to be inserted.
 * @param {boolean} args.isPublish - Indicates if a publish operation.
 * @param {boolean} args.isTest - Indicates if testing.
 * @returns {number} The ID of the newly-created post.
 */
exports.createPost = ({ post, isPublish, isTest }) => {
  return Promise.resolve()
    .then(() => filer.uploadImages(post, { isTest }))
    .then((post) => new PostMutationBuilder(knex, 'posts').insert(post).build())
    .then(([id]) => ({ id }))
    .catch(debug);
};

/**
 * Updates the fields of a post into the database.
 * @param {object} args - The arguments.
 * @param {number} args.id - The ID of the post to update.
 * @param {object} args.post - The post object to be updated.
 * @param {boolean} args.isPublish - Indicates if a publish operation.
 * @param {boolean} args.isTest - Indicates if testing.
 * @returns {object} The post after being updated.
 */
exports.updatePost = ({ id, post, isPublish, isTest }) => {
  return Promise.resolve()
    .then(() => filer.replaceImages(id, post, { isTest }))
    .then((updatedPost) =>
      new PostMutationBuilder(knex, 'posts')
        .update(updatedPost)
        .whereId(id)
        .build()
    )
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
    .then(() => new PostQueryBuilder(knex).whereId(id).build())
    .then(([post]) => {
      if (!post) throw ERRORS.NO_POST_WITH_ID(id);

      const promises = [];
      const images = Post.collateImages(post);
      images.forEach((image) => {
        promises.push(filer.destroyImage(image));
      });
      return Promise.all(promises);
    })
    .then(() => new PostMutationBuilder(knex, 'posts').delete(id).build())
    .then(() => ({ id }))
    .catch(debug);
};
