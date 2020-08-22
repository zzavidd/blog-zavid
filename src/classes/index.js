const PostQueryBuilder = require('./builders/post-query');
const URLBuilder = require('./builders/url');
const Post = require('./post');

module.exports = {
  Post: Post.default,
  URLBuilder: URLBuilder.default,
  PostQueryBuilder: PostQueryBuilder.default
};
