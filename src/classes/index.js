const { PostBuilder, DiaryEntryBuilder } = require('./builders/entity');
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

  URLBuilder
};
