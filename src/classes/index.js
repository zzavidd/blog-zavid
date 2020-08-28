const {
  PostQueryBuilder,
  PostMutationBuilder
} = require('./builders/query');
const URLBuilder = require('./builders/url');
const Post = require('./entities/post');

module.exports = {
  Post,
  URLBuilder,
  PostQueryBuilder,
  PostMutationBuilder
};
