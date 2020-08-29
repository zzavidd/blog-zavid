const {
  PostQueryBuilder,
  PostMutationBuilder
} = require('../../classes/builders/query');
const { debug, ERRORS } = require('../error');
const filer = require('../filer');
const knex = require('../singleton').getKnex();

/**
 * Retrieves all posts from database.
 * @param {object} args The arguments.
 * @param {number} args.limit Defines the number of results to return.
 * @param {object} args.sort Defines how to order the results.
 * @param {string} args.sort.field The field to sort by.
 * @param {string} args.sort.order The order. Whether ascending, descending or random.
 * @param {object} args.type The types to filter by.
 * @param {string[]} args.type.include The types to include in results.
 * @param {string[]} args.type.exclude The types to include in results.
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
 * @returns {number} The ID of the newly-created post.
 */
exports.createPost = ({ post, isPublish }) => {
  return Promise.resolve()
    .then(() => filer.uploadImage(post))
    .then((post) => {
      return new PostMutationBuilder(knex, 'posts').insert(post).build();
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
      return new PostMutationBuilder(knex, 'posts')
        .update(updatedPost)
        .whereId(id)
        .build();
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
      if (!post) throw ERRORS.NO_POST_WITH_ID(id);
      return filer.destroyImage(post.image);
    })
    .then(() => {
      return new PostMutationBuilder(knex, 'posts').delete(id).build();
    })
    .then(() => {
      return { id };
    })
    .catch(debug);
};
