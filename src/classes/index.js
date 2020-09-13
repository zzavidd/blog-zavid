const {
  PostBuilder,
  DiaryEntryBuilder,
  SubscriberBuilder
} = require('./builders/entity');
const ErrorBuilder = require('./builders/error.builder');
const {
  PostQueryBuilder,
  PostMutationBuilder,
  DiaryQueryBuilder,
  DiaryMutationBuilder,
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

  Subscriber,
  SubscriberBuilder,
  SubscriberQueryBuilder,
  SubscriberMutationBuilder,

  ErrorBuilder,
  URLBuilder
};
