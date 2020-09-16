const {
  PostBuilder,
  DiaryEntryBuilder,
  SubscriberBuilder
} = require('./builders/entity');
const ErrorBuilder = require('./builders/error.builder');
const {
  DiaryQueryBuilder,
  DiaryMutationBuilder,
  PageQueryBuilder,
  PageMutationBuilder,
  PostQueryBuilder,
  PostMutationBuilder,
  SubscriberQueryBuilder,
  SubscriberMutationBuilder
} = require('./builders/query');
const URLBuilder = require('./builders/url.builder');
const { Post, Diary, Subscriber } = require('./static');

module.exports = {
  Post,
  PostBuilder,
  PostQueryBuilder,
  PostMutationBuilder,

  Diary,
  DiaryEntryBuilder,
  DiaryQueryBuilder,
  DiaryMutationBuilder,

  PageQueryBuilder,
  PageMutationBuilder,

  Subscriber,
  SubscriberBuilder,
  SubscriberQueryBuilder,
  SubscriberMutationBuilder,

  ErrorBuilder,
  URLBuilder
};
