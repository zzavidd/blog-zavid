const PostBuilder = require('./builders/post.builder');
const {
  PostQueryBuilder,
  PostMutationBuilder
} = require('./builders/query/post.query');
const URLBuilder = require('./builders/url.builder');
const Post = require('./static/post.static');

module.exports = {
  Post,
  PostBuilder,
  PostQueryBuilder,
  PostMutationBuilder,
  URLBuilder,
};
