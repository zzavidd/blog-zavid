const { PostBuilder, DiaryEntryBuilder } = require('./builders/entity');
const ErrorBuilder = require('./builders/error.builder');
const {
  PostQueryBuilder,
  PostMutationBuilder,
  DiaryQueryBuilder,
  DiaryMutationBuilder
} = require('./builders/query');
const URLBuilder = require('./builders/url.builder');
const { Post, Diary } = require('./static');

module.exports = {
  Post,
  PostBuilder,
  PostQueryBuilder,
  PostMutationBuilder,

  Diary,
  DiaryEntryBuilder,
  DiaryQueryBuilder,
  DiaryMutationBuilder,

  ErrorBuilder,
  URLBuilder
};
